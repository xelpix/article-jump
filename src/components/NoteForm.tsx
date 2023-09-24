import { Form, Stack, Row, Col, Button } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useGlobalContext } from '../context';
import { useState, FormEvent, ChangeEvent } from 'react';

export type FormDataType = {
  title: string;
  tag: string;
  content: string;
};

const NoteForm = ({ isEditing }: { isEditing: boolean }) => {
  const { createNewTopic, topics, editTopic } = useGlobalContext();
  const navigate = useNavigate();

  const { id: paramsID } = useParams();

  const currentTopic = topics.find((el) => el.id === paramsID);

  const initialFormData =
    isEditing && currentTopic
      ? {
          title: currentTopic.title,
          tag: currentTopic.tag,
          content: currentTopic.content,
        }
      : {
          title: '',
          tag: '',
          content: '',
        };

  const [formData, setFormData] = useState(initialFormData);

  const { title, tag, content } = formData;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (title && content && tag && tag !== 'Выберите главный тег статьи:') {
      if (isEditing && currentTopic) {
        editTopic({
          ...formData,
          id: currentTopic.id,
          postDate: currentTopic.postDate,
          author: currentTopic.author,
          comments: currentTopic.comments,
        });
      } else {
        createNewTopic(formData);
      }

      setFormData({
        title: '',
        tag: '',
        content: '',
      });

      if (isEditing && currentTopic) {
        navigate(`/topics/${currentTopic.id}`);
      } else {
        navigate('..');
      }
    } else {
      alert('Пожалуйста, заполните все поля!');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Stack gap={4}>
        <Row>
          <Col>
            <Form.Group controlId="formTitle">
              <Form.Label>Заголовок</Form.Label>
              <Form.Control value={title} onChange={handleChange} name="title" />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formTag">
              <Form.Label>Тэг</Form.Label>
              <Form.Select
                value={tag}
                onChange={handleChange}
                name="tag"
                aria-label="Default select example"
              >
                <option value="">Выберите главный тег статьи:</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="js">JS</option>
                <option value="react">React</option>
                <option value="other">Другое</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Form.Group controlId="formContent">
          <Form.Label>Статья</Form.Label>
          <Form.Control
            value={content}
            onChange={handleChange}
            name="content"
            as="textarea"
            rows={15}
          />
        </Form.Group>
        <Stack direction="horizontal" gap={2} className="justify-content-end">
          <Button type="submit" variant="primary">
            {isEditing ? 'Сохранить изменения' : 'Опубликовать'}
          </Button>
          <Link to={`${isEditing ? `/topics/${paramsID}` : '..'}`}>
            <Button type="button" variant="outline-secondary">
              Отменить
            </Button>
          </Link>
        </Stack>
      </Stack>
    </Form>
  );
};

export default NoteForm;
