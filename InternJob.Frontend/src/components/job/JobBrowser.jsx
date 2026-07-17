import { useEffect, useMemo, useState } from "react";
import * as api from "../../mockapi";
import JobCard from "./JobCard";
import axios from "axios";
import { SearchBar, FilterSelect, FilterBar } from "../common/SearchFilterBar";
import { SkeletonList } from "../common/States";
import { EmptyState } from "../common/States";
import Pagination, { paginate } from "../common/Pagination";

const LOCATIONS = ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng"];
const PAGE_SIZE = 6;

export default function JobBrowser({ detailBasePath }) {
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [page, setPage] = useState(1);
  const[totalPages, setTotalPages] = useState(1);

  // ĐOẠN CODE MỚI THAY THẾ:
 useEffect(() => {
    setLoading(true);
    
    axios.get(`http://localhost:5248/api/Job/search`, {
        params: {
            Page: page,
            PageSize: 6,
            Keyword : keyword,
            Location: location === "Tất cả địa điểm" ? "" : location,
            CategoryId: categoryId
          }
    })
    .then(response => {
       setJobs(response.data.items);
        // Quan trọng: Cập nhật tổng số trang nếu API trả về
        if (response.data.totalPages) {
            setTotalPages(response.data.totalPages);
        }
        setLoading(false);
    })
    .catch(error => {
        console.error("Lỗi kết nối API:", error);
        setLoading(false);
    });

}, [page,keyword,location]);
  const filtered = useMemo(() => {
    return jobs.filter((j) => {
        // Lưu ý: Đảm bảo j.location khớp với giá trị trong dropdown
        if (keyword && !j.title.toLowerCase().includes(keyword.toLowerCase())) return false;
        if (location && location !== "Tất cả địa điểm" && j.location !== location) return false;
        return true;
    });
}, [jobs, keyword, location,categoryId]);


  // const { pageItems, totalPages }=paginate(filtered, page, PAGE_SIZE);
  const categoryName = (id) => categories.find((c) => c.id === id)?.name || "";

  return (
    <div>
      {/* <h1>DAT DEP TRAI DANG KET NOI DATABASE</h1> */}
      <FilterBar>
        <SearchBar value={keyword} 
        onChange={(v) => { setKeyword(v); setPage(1); }} 
        placeholder="Tìm theo tên công việc..." 
        />
        <FilterSelect value={location} onChange=
        {(v) => { setLocation(v); setPage(1); }} 
        placeholder="Tất cả địa điểm" 
        options={LOCATIONS.map((l) => ({ value: l, label: l }))}
        />
        {/* <FilterSelect value={categoryId} 
        onChange={(v) => { setCategoryId(v); setPage(1); }} 
        placeholder="Tất cả ngành nghề" 
        options={categories.map((c) => ({ value: c.id, label: c.name }))}
        /> */}
      </FilterBar>

      {loading ? (
        <SkeletonList count={4} />
      ) : jobs.length === 0 ? (
        <EmptyState 
        title="Không tìm thấy việc làm phù hợp" 
        description="Thử thay đổi từ khóa hoặc bộ lọc."
        />
      ) : (
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Đổi pageItems.map thành jobs.map để lặp qua dữ liệu thật từ Database */}
          {jobs.map((job) => (
            <JobCard 
              key={job.jobId || job.id} 
              job={{
                ...job,
                id: job.jobId || job.id, // Đề phòng Backend trả về thuộc tính viết hoa/thường (jobId hoặc id)
                title: job.title || "Không có tiêu đề",
                location: job.location || "Chưa xác định",
                salary: job.salary || (job.salaryMin && job.salaryMax ? `${job.salaryMin} - ${job.salaryMax}` : "Thỏa thuận")
              }} 
              categoryName={job.categoryName || "Công nghệ thông tin"} 
              detailPath={`${detailBasePath}/${job.jobId || job.id}`} 
            />
          ))}
        </div>
      )}
      <Pagination page={page}
      totalPages={totalPages} 
      onChange={setPage} />
    </div>
  );
}
