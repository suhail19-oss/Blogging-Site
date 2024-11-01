import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../Editor";

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:4000/post/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const postInfo = await response.json();
        setTitle(postInfo.title);
        setContent(postInfo.content);
        setSummary(postInfo.summary);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Error fetching post: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  async function updatePost(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('id', id);

    if (files?.[0]) {
      data.set('file', files[0]);
    }

    try {
      const response = await fetch(`http://localhost:4000/post/${id}`, {
        method: 'PUT',
        body: data,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update post');
      }

      setRedirect(true);
    } catch (err) {
      console.error('Update error:', err);
      setError('Error updating post: ' + err.message);
    }
  }

  if (redirect) {
    return <Navigate to={`/post/${id}`} />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={updatePost}>
      <input
        type="text"
        placeholder={'Title'}
        value={title}
        onChange={ev => setTitle(ev.target.value)}
        required
      />
      <input
        type="text"
        placeholder={'Summary'}
        value={summary}
        onChange={ev => setSummary(ev.target.value)}
        required
      />
      <input
        type="file"
        onChange={ev => setFiles(ev.target.files)}
      />
      {files && files[0] && <div>Selected file: {files[0].name}</div>}
      <Editor onChange={setContent} value={content} />
      <button style={{ marginTop: '5px' }}>Update the Post</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
}
