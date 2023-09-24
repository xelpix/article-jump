import NoteForm from '../components/NoteForm';

const NewTopic = () => {
  return (
    <>
      <h1 className="mb-4">Новая Статья</h1>
      <NoteForm isEditing={false} />
    </>
  );
};

export default NewTopic;
