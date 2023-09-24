import { Badge, Button, Col, Row, Stack, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { commentType, useGlobalContext } from '../context';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FormEvent, useState, useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import { colorForTopic } from '../utils';

const TopicPage = () => {
  const { topics, deleteTopic, createComment, deleteComment, user, loading } = useGlobalContext();
  const navigate = useNavigate();
  const { id: paramsID } = useParams();
  const currentTopic = topics.find((el) => el.id === paramsID);
  const [comments, setComments] = useState<commentType[]>(currentTopic?.comments || []);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (currentTopic) {
      setComments(currentTopic.comments);
    }
  }, [currentTopic]);

  const handleDelete = (id: string | undefined) => {
    if (id) deleteTopic(id);
    navigate('..');
  };

  const handleCommentSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('чтобы написать комментарий, войдите в свой аккаунт');
      return;
    }
    if (!comment) return;
    if (currentTopic) {
      createComment(currentTopic, comment);
    }
    setComment('');
  };

  const handleCommentDelete = (commentID: string) => {
    if (currentTopic) {
      deleteComment(currentTopic, commentID);
    }
  };

  const markdownContent = currentTopic?.content || '';
  const formattedContent = markdownContent.replace(/\n/g, '  \n');

  // handling Timestamp object from firebase
  const formattedDate = currentTopic?.postDate
    ? format(getDateFromTopic(currentTopic.postDate), 'dd.MM.yyyy')
    : '';
  const formattedTime = currentTopic?.postDate
    ? format(getDateFromTopic(currentTopic.postDate), 'HH:mm')
    : '';

  function getDateFromTopic(postDate: Date | Timestamp): Date {
    return postDate instanceof Timestamp ? postDate.toDate() : postDate;
  }

  if (loading) {
    return <h1>Грузим...</h1>;
  }

  return (
    <Row className="align-items-center ">
      <Col className="gap-4" xs={12} md={6}>
        <h1>{currentTopic?.title}</h1>
        <Badge bg={colorForTopic(currentTopic?.tag)}> {currentTopic?.tag} </Badge>
      </Col>
      <Col xs={12} md={6}>
        <Stack gap={2} direction="horizontal" className="mt-2 d-flex justify-content-end">
          {(user?.email === currentTopic?.author || user?.email === 'admin@admin.com') && (
            <>
              <Link to={`/edit/${currentTopic?.id}`}>
                <Button variant="outline-primary">Редактировать</Button>
              </Link>
              <Button onClick={() => handleDelete(currentTopic?.id)} variant="outline-danger">
                Удалить
              </Button>
            </>
          )}

          <Link to="..">
            <Button variant="outline-secondary">Назад</Button>
          </Link>
        </Stack>
      </Col>

      <div>
        <ReactMarkdown className="mt-4">{formattedContent}</ReactMarkdown>
      </div>

      <div>
        <p className="published">
          опубликовано <span className="user">{currentTopic?.author}</span> {formattedDate} в{' '}
          {formattedTime}
        </p>
      </div>

      <Col className="mb-auto mt-3" xs={12} md={6}>
        <h5>Напишите свой комментарий:</h5>
        <Form onSubmit={handleCommentSubmit}>
          <Form.Control
            value={comment}
            as="textarea"
            onChange={(e) => setComment(e.target.value)}
            className="mb-3"
            rows={4}
          ></Form.Control>
          <Button type="submit" variant="primary">
            Отправить
          </Button>
        </Form>
      </Col>
      <Col className="mb-auto" xs={12} md={6}>
        <div className="mt-5">
          {comments.map((comment, index) => (
            <div key={index} className="comment-bg p-2 rounded mb-2 position-relative">
              <h5>
                {comment.user}
                {user?.email === comment.user && <span className="text-success">(Вы)</span>}
              </h5>
              <p>{comment.content}</p>
              {/* condition if user is the same! then render: */}
              {(user?.email === comment.user || user?.email === 'admin@admin.com') && (
                <AiOutlineClose
                  onClick={() => handleCommentDelete(comment.id)}
                  className="position-absolute top-0 end-0 m-2"
                  style={{ cursor: 'pointer' }}
                />
              )}
            </div>
          ))}
        </div>
      </Col>
    </Row>
  );
};

export default TopicPage;
