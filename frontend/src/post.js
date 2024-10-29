export default function Post() {
  return (
    <div className="post">
      <div className="image">
        <img
          src="https://techcrunch.com/wp-content/uploads/2024/09/GettyImages-496822526.jpg?resize=1280,853"
          alt=""
        ></img>
      </div>
      <div className="texts">
        <h2>
          Researchers question AI's 'reasoning' ability as models stumble on
          math problems with trivial changes
        </h2>
        <p className="info">
          <a className="author">Dawid Paszko</a>
          <time>01-10-2024 16:45</time>
        </p>
        <p className="summary">
          A group of AI research scientists at Apple released their paper,
          “Understanding the limitations of mathematical reasoning in large
          language models,” to general commentary Thursday.
        </p>
      </div>
    </div>
  );
}
