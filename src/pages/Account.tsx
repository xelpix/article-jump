import { Card, Stack } from 'react-bootstrap';
import { useGlobalContext } from '../context';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';
import { colorForTopic } from '../utils';

const Account = () => {
  const { topics, user } = useGlobalContext();

  useEffect(() => {
    localStorage.setItem('lastPage', window.location.pathname);
  }, []);

  const userTopics = topics.filter((topic) => {
    return topic.author === user?.email;
  });

  return (
    <>
      <p>
        Вы вошли как: <span className="bold">{user?.email}</span>{' '}
      </p>

      <Stack className="mt-4">
        {userTopics.length <= 0 && (
          <h3>
            У вас пока нет статей! <br />
          </h3>
        )}
        {userTopics.length > 0 && <h3>Ваши статьи:</h3>}
        {userTopics.length > 0 &&
          userTopics
            .sort((a, b) => {
              const dateA = a.postDate instanceof Timestamp ? a.postDate.toDate() : a.postDate;
              const dateB = b.postDate instanceof Timestamp ? b.postDate.toDate() : b.postDate;
              return dateB.getTime() - dateA.getTime();
            })
            .map((el) => {
              const timestampFromFirestore = el.postDate as Timestamp;
              const postDate = timestampFromFirestore.toDate();
              const formattedDate = format(postDate, 'dd.MM.yyyy');

              return (
                <Link key={el.id} to={`/topics/${el.id}`} className="text-decoration-none">
                  <Card bg={colorForTopic(el.tag)} text="white" className="mb-2">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center">
                        <Card.Title className="m-0">{el.title}</Card.Title>
                        <Card.Text>{formattedDate}</Card.Text>
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
export default Account;
