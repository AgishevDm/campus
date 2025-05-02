import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronDown, FiChevronUp, FiArrowLeft } from 'react-icons/fi';
import './FAQ.scss';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ = () => {
  const [openSections, setOpenSections] = useState<number[]>([]);
  const [faqData, setFaqData] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaqData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/faq`);
        if (!response.ok) {
          throw new Error('Ошибка при загрузке данных');
        }
        const data = await response.json();
        setFaqData(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Произошла неизвестная ошибка');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFaqData();
  }, []);

  const toggleSection = (index: number) => {
    setOpenSections(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  if (loading) {
    return <div className="faq-container">Загрузка...</div>;
  }

  if (error) {
    return <div className="faq-container">Ошибка: {error}</div>;
  }

  return (
    <div className="faq-container">
      <div className="faq-header-wrapper">
        <Link to="/profile" className="back-button">
          <div className="back-button-wrapper">
            <FiArrowLeft size={24} />
          </div>
        </Link>
        <h1 className="faq-title">Часто задаваемые вопросы</h1>
      </div>

      <div className="faq-list">
        {faqData.map((item, index) => (
          <div key={index} className="faq-item">
            <button 
              className="faq-header"
              onClick={() => toggleSection(index)}
            >
              <span className="faq-question">{item.question}</span>
              {openSections.includes(index) ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            {openSections.includes(index) && (
              <div className="faq-content">
                <p className="faq-answer">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;