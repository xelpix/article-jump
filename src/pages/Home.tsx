import Search from '../components/Search';
import Stack from 'react-bootstrap/Stack';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { useGlobalContext } from '../context';
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import { colorForTopic } from '../utils';

const Home = () => {
  const { topics, searchQuery, searchTags, loading } = useGlobalContext();

  if (loading) return <h2>Грузим...</h2>;

  const filteredData = topics.filter(
    (item) =>
      item.title &&
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      searchTags.some((tag) => item.tag.includes(tag))
  );

  return (
    <>
      <Search />
      <Stack className="mt-4">
        {topics.length <= 0 && <h3> Нет статьи? Создайте свою!</h3>}
        {searchTags.length <= 0 && <h3>Выберите хотя бы один тег для поиска!</h3>}
        {filteredData.length <= 0 && searchTags.length > 0 && (
          <h3>По этому запросу ничего не найдено!</h3>
        )}
        {topics.length > 0 &&
          filteredData
            .sort((a, b) => {
              const dateA = a.postDate instanceof Timestamp ? a.postDate.toDate() : a.postDate;
              const dateB = b.postDate instanceof Timestamp ? b.postDate.toDate() : b.postDate;
              return dateB.getTime() - dateA.getTime();
            })
            .map((el) => {
              const postDate =
                el.postDate instanceof Timestamp ? el.postDate.toDate() : el.postDate;
              const formattedDate = format(postDate, 'dd.MM.yyyy');

              return (
                <Link key={el.id} to={`/topics/${el.id}`} className="text-decoration-none">
                  <Card bg={colorForTopic(el.tag)} text="white" className="mb-2">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center">
                        <Card.Title className="m-0">{el.title}</Card.Title>
                        <div className="d-flex gap-4 ">
                          <Card.Text className="m-0">{el.author}</Card.Text>
                          <Card.Text>{formattedDate}</Card.Text>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Link>
              );
            })}
      </Stack>
    </>
  );
};

export default Home;
