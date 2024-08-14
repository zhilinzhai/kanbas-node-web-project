import { FaSearch } from 'react-icons/fa';
import '../../styles.css';

export default function AssignmentSearch() {
  return (
    <div className="input-group" id="wd-search-assignment">
      <div className="input-group-prepend">
        <span className="input-group-text" id="basic-addon1">
          <FaSearch />
        </span>
      </div>
      <input
        type="text"
        className="form-control"
        placeholder="Search"
        aria-label="Search"
        aria-describedby="basic-addon1"
      />
    </div>
  );
}
