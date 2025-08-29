import { formatISO9075,format } from "date-fns";
import { Link } from "react-router";
import { API_BASE_URL } from "../config.js";

export default function Post({ _id,title, summary, content, cover, createdAt, author }) {
  return (
    <div className="post">
      <Link to={`/post/${_id}`}>
      <div className="image">
        
        <img
          src={`https://mern-blog-production-336f.up.railway.app/${cover}`}
          alt={title}
        />
      </div>
      </Link>
      <div className="content">
        <Link to={`/post/${_id}`}>
        <h2>{title}</h2>
        </Link>
        <p className="info">
           <a className="author">{author?.username || "Unknown"}</a>
          <time>{formatISO9075(new Date(createdAt))}</time>
        </p>
        <p className="summary">{summary}</p>
      </div>
    </div>
  );
}
