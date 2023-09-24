import { v4 as uuidv4 } from 'uuid';
import { createContext, useContext, useState, useEffect } from 'react';
import { FormDataType } from '../components/NoteForm'; // { title, tag, content }

// FIREBASE:
import { auth, db } from '../firebase';
import { User } from 'firebase/auth'; // grab that type directly from firebase!
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { setDoc, doc, getDoc, Timestamp } from 'firebase/firestore';

/** TYPES! */
export type commentType = {
  id: string;
  user: string;
  content: string;
  date: Date;
};

export type TopicType = {
  id: string;
  title: string;
  tag: string;
  content: string;
  postDate: Date | Timestamp;
  author: string;
  comments: commentType[];
};

type AppContextType = {
  loading: boolean;
  user: User | null;
  createUser: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  topics: TopicType[];
  searchQuery: string;
  searchTags: string[];
  setSearchTags: React.Dispatch<React.SetStateAction<string[]>>;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  createNewTopic: (formData: FormDataType) => void;
  editTopic: (editedTopicProp: TopicType) => void;
  deleteTopic: (id: string) => void;
  createComment: (currentTopic: TopicType, comment: string) => void;
  deleteComment: (currentTopic: TopicType, commentID: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [topics, setTopics] = useState<TopicType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTags, setSearchTags] = useState(['html', 'css', 'js', 'react', 'other']);
  const [loading, setLoading] = useState(true);

  // CREATE USER:
  const createUser = async (email: string, password: string): Promise<void> => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  // LOGIN:
  const login = async (email: string, password: string): Promise<void> => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  // LOGOUT:
  const logout = async (): Promise<void> => {
    await signOut(auth);
    localStorage.removeItem('lastPage');
  };

  // CREATE TOPIC
  const createNewTopic = (formData: FormDataType) => {
    const { title, tag, content } = formData;
    const newTopic: TopicType = {
      id: uuidv4(),
      title: title,
      tag: tag,
      content: content,
      postDate: new Date(),
      author: user?.email || '',
      comments: [],
    };

    setTopics((prevTopics) => [...prevTopics, newTopic]);
  };

  // EDIT TOPIC
  const editTopic = (editedTopicProp: TopicType) => {
    const { id, title, tag, content, postDate, author, comments } = editedTopicProp;
    const editedTopic: TopicType = {
      id,
      title,
      tag,
      content,
      postDate,
      author,
      comments,
    };

    setTopics((prevTopics) => {
      return prevTopics.map((el) => {
        if (el.id === editedTopic.id) {
          return editedTopic;
        } else {
          return el;
        }
      });
    });
  };

  // DELETE TOPIC
  const deleteTopic = (id: string) => {
    setTopics((prevTopics) => {
      return prevTopics.filter((el) => el.id !== id);
    });
  };

  /** GRAB FROM FIRESTORE: */
  useEffect(() => {
    const fetchTopics = async () => {
      const docRef = doc(db, 'topics', 'topicsID');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const topicsData = docSnap.data();
        const topicsArr = topicsData.topicsArr;
        setTopics(topicsArr);
      } else {
        console.log('No such document!');
      }

      setLoading(false);
    };
    fetchTopics();
  }, []);

  /** SAVE TO FIRESTORE: */
  useEffect(() => {
    const saveTopicsToFirestore = async (topics: TopicType[]) => {
      if (topics.length > 0) {
        await setDoc(doc(db, 'topics', 'topicsID'), {
          topicsArr: topics,
        });
      }
    };
    saveTopicsToFirestore(topics);
  }, [topics]);

  /** CREATE COMMENT: */
  const createComment = (currentTopic: TopicType, comment: string) => {
    const newComment: commentType = {
      id: uuidv4(),
      user: user?.email || '',
      content: comment,
      date: new Date(),
    };
    setTopics((prevTopics) => {
      return prevTopics.map((el) => {
        if (el.id === currentTopic.id) {
          const updatedComments = [...el.comments, newComment];
          return { ...el, comments: updatedComments };
        } else {
          return el;
        }
      });
    });
  };

  /**  DELETE COMMENT: */
  const deleteComment = (currentTopic: TopicType, commentID: string) => {
    setTopics((prevTopics) => {
      return prevTopics.map((el) => {
        if (el.id === currentTopic.id) {
          const updatedComments = el.comments.filter((comment) => comment.id !== commentID);
          return { ...el, comments: updatedComments };
        } else {
          return el;
        }
      });
    });
  };

  /**  LISTEN FOR FIREBASE USER: */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        topics,
        createNewTopic,
        deleteTopic,
        searchQuery,
        setSearchQuery,
        searchTags,
        setSearchTags,
        editTopic,
        createComment,
        deleteComment,
        user,
        createUser,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext) as AppContextType;
};

export { AppContext, AppProvider };
