import { format } from "date-fns";
import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:4000/post/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setPostInfo(data);
      })
      .catch((error) => {
        console.error("Error fetching post:", error);
      });
  }, [id]);

  if (!postInfo) return <div>Loading...</div>;

  const { title, cover, content, createdAt, author } = postInfo;

  return (
    <div className="post-page">
      <h1>{title}</h1>
      <time>{format(new Date(createdAt), "MMM d, yyyy HH:mm")}</time>
      <div className="author">By {author.username}</div>

      <div className="image">
        <img src={`http://localhost:4000/${cover}`} alt={title} />
      </div>
      <div className="content" dangerouslySetInnerHTML={{ __html: content }} />

      {userInfo.id === author._id && (
        <div className="edit-row">
          <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
              />
            </svg>
            Edit this Post
          </Link>
        </div>
      )}
    </div>
  );
}
