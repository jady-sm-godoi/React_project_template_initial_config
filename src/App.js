import { useState } from 'react';
import { useFetch } from './hooks/useFetch';

function App() {
  const [postId, setPostId] = useState('');
  const [result, loading] = useFetch('https://jsonplaceholder.typicode.com/posts/' + postId);

  const handleClick = (id) => {
    setPostId(id);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!loading && result) {
    return (
      <div>
        {result?.length > 0 ? (
          result.map((r) => (
            <h2 key={r.id} onClick={() => handleClick(r.id)}>
              {r.title}
            </h2>
          ))
        ) : (
          <h2 onClick={() => handleClick('')}>{result.title}</h2>
        )}
      </div>
    );
  }

  return <h1>Oi</h1>;
}

export default App;
