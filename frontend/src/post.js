import { formatISO9075 } from 'date-fns';

export default function Post({title,summary,cover,content,createdAt}) {
  return (
    <div className="post">
      <div className="image">
        <img
          src="https://techcrunch.com/wp-content/uploads/2024/09/GettyImages-496822526.jpg?resize=1280,853" alt=""></img>
      </div>
      <div className="texts">
        <h2>{title}</h2>
        <p className="info">
          <a className="author">Dawid Paszko</a>
          <time>{formatISO9075(new Date(createdAt))}</time>
        </p>
        <p className="summary">{summary}</p>
      </div>
    </div>
  );
}
