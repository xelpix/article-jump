import NoteForm from '../components/NoteForm';

const EditTopic = () => {
  return (
    <>
      <h1 className="mb-4">Редактирование</h1>
      <NoteForm isEditing={true} />
    </>
  );
};
export default EditTopic;
