import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { Row } from 'react-bootstrap';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import { useGlobalContext } from '../context';

const Search = () => {
  const { searchQuery, setSearchQuery, setSearchTags, searchTags } = useGlobalContext();
  const handleChange = (val: any) => setSearchTags(val); // change any later

  return (
    <Form>
      <Row className="justify-content-between flex-column flex-sm-row gap-3">
        <Col>
          <Form.Group controlId="title">
            <Form.Control
              type="text"
              value={searchQuery}
              placeholder="Поиск по заголовку.."
              onChange={(e) => setSearchQuery(e.target.value)}
            ></Form.Control>
          </Form.Group>
        </Col>
        <Col className="d-flex align-items-center justify-content-end">
          <ToggleButtonGroup type="checkbox" value={searchTags} onChange={handleChange}>
            <ToggleButton variant="outline-success" id="tbg-btn-1" value="html">
              HTML
            </ToggleButton>
            <ToggleButton variant="outline-primary" id="tbg-btn-2" value="css">
              CSS
            </ToggleButton>
            <ToggleButton variant="outline-warning" id="tbg-btn-3" value="js">
              JS
            </ToggleButton>
            <ToggleButton variant="outline-info" id="tbg-btn-4" value="react">
              React
            </ToggleButton>
            <ToggleButton variant="outline-secondary" id="tbg-btn-5" value="other">
              Другое
            </ToggleButton>
          </ToggleButtonGroup>
        </Col>
      </Row>
    </Form>
  );
};

export default Search;
