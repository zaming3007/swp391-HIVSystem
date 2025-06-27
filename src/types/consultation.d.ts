declare module '../../components/consultation/QuestionList' {
    interface Question {
        id: string;
        title: string;
        content: string;
        status: 'pending' | 'answered';
        createdAt: string;
        category: string;
        answers?: Answer[];
    }

    interface QuestionListProps {
        questions: Question[];
        selectedQuestionId: string | null;
        onQuestionSelect: (id: string) => void;
    }

    const QuestionList: React.FC<QuestionListProps>;
    export default QuestionList;
}

declare module '../../components/consultation/QuestionDetail' {
    interface Answer {
        id: string;
        content: string;
        createdAt: string;
        counselor: string;
    }

    interface Question {
        id: string;
        title: string;
        content: string;
        status: 'pending' | 'answered';
        createdAt: string;
        category: string;
        answers?: Answer[];
    }

    interface QuestionDetailProps {
        question: Question;
        onClose: () => void;
    }

    const QuestionDetail: React.FC<QuestionDetailProps>;
    export default QuestionDetail;
}

declare module '../../components/consultation/AskQuestionForm' {
    const AskQuestionForm: React.FC;
    export default AskQuestionForm;
} 