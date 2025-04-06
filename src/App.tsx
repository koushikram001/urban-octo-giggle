import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, ThumbsUp, ThumbsDown, Briefcase, GraduationCap, MessageCircle, X, Undo2 } from 'lucide-react';

// Sample data for demonstration
const sampleProfiles = [
  {
    id: 1,
    name: "Alex Johnson",
    title: "Frontend Developer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    experience: "5 years",
    skills: ["React", "TypeScript", "CSS", "Node.js"],
    education: "B.S. Computer Science, Stanford University",
    bio: "Passionate developer with experience building scalable web applications. Previously worked at Google and Facebook."
  },
  {
    id: 2,
    name: "Samantha Lee",
    title: "UX Designer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    experience: "4 years",
    skills: ["Figma", "User Research", "Prototyping", "UI Design"],
    education: "M.A. Human-Computer Interaction, Carnegie Mellon",
    bio: "Creative designer focused on creating intuitive and accessible user experiences. Portfolio includes work for Fortune 500 companies."
  },
  {
    id: 3,
    name: "Marcus Williams",
    title: "Data Scientist",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    experience: "3 years",
    skills: ["Python", "Machine Learning", "SQL", "Data Visualization"],
    education: "Ph.D. Statistics, MIT",
    bio: "Data scientist specializing in predictive modeling and machine learning algorithms. Published researcher with industry experience."
  },
  {
    id: 4,
    name: "Priya Patel",
    title: "Product Manager",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    experience: "6 years",
    skills: ["Product Strategy", "Agile", "Market Research", "User Stories"],
    education: "MBA, Harvard Business School",
    bio: "Strategic product manager with experience launching successful products from concept to market. Strong background in user-centered design."
  },
  {
    id: 5,
    name: "David Chen",
    title: "Backend Engineer",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    experience: "7 years",
    skills: ["Java", "Spring Boot", "AWS", "Microservices"],
    education: "M.S. Computer Engineering, UC Berkeley",
    bio: "Experienced backend developer specializing in high-performance, scalable systems. Led engineering teams at multiple startups."
  }
];

function App() {
  const [profiles, setProfiles] = useState(sampleProfiles);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProfiles, setSelectedProfiles] = useState<number[]>([]);
  const [rejectedProfiles, setRejectedProfiles] = useState<number[]>([]);
  const [direction, setDirection] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [sentMessages, setSentMessages] = useState<{id: number, message: string}[]>([]);
  const [profileHistory, setProfileHistory] = useState<{index: number, action: 'select' | 'reject'}[]>([]);
  const [isUndoing, setIsUndoing] = useState(false);

  const currentProfile = profiles[currentIndex];
  const hasMoreProfiles = currentIndex < profiles.length - 1;
  const canUndo = profileHistory.length > 0;

  const handleSelect = () => {
    if (currentProfile) {
      setSelectedProfiles([...selectedProfiles, currentProfile.id]);
      setProfileHistory([...profileHistory, {index: currentIndex, action: 'select'}]);
      setDirection('right');
      setTimeout(() => {
        setDirection(null);
        if (hasMoreProfiles) {
          setCurrentIndex(currentIndex + 1);
          setOffsetX(0);
        }
      }, 300);
    }
  };

  const handleReject = () => {
    if (currentProfile) {
      setRejectedProfiles([...rejectedProfiles, currentProfile.id]);
      setProfileHistory([...profileHistory, {index: currentIndex, action: 'reject'}]);
      setDirection('left');
      setTimeout(() => {
        setDirection(null);
        if (hasMoreProfiles) {
          setCurrentIndex(currentIndex + 1);
          setOffsetX(0);
        }
      }, 300);
    }
  };

  const handleUndo = () => {
    if (canUndo && !isUndoing) {
      setIsUndoing(true);
      
      const lastAction = profileHistory[profileHistory.length - 1];
      const newHistory = [...profileHistory];
      newHistory.pop();
      setProfileHistory(newHistory);
      
      // Remove from selected or rejected lists
      if (lastAction.action === 'select') {
        setSelectedProfiles(selectedProfiles.filter(id => id !== profiles[lastAction.index].id));
      } else {
        setRejectedProfiles(rejectedProfiles.filter(id => id !== profiles[lastAction.index].id));
      }
      
      // Animate going back
      setDirection(lastAction.action === 'select' ? 'undo-right' : 'undo-left');
      
      setTimeout(() => {
        setCurrentIndex(lastAction.index);
        setDirection(null);
        setOffsetX(0);
        setIsUndoing(false);
      }, 300);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const currentX = e.clientX;
      const newOffset = currentX - startX;
      setOffsetX(newOffset);
      
      if (newOffset > 50) {
        setDirection('right');
      } else if (newOffset < -50) {
        setDirection('left');
      } else {
        setDirection(null);
      }
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      if (offsetX > 100) {
        handleSelect();
      } else if (offsetX < -100) {
        handleReject();
      } else {
        setOffsetX(0);
        setDirection(null);
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      const currentX = e.touches[0].clientX;
      const newOffset = currentX - startX;
      setOffsetX(newOffset);
      
      if (newOffset > 50) {
        setDirection('right');
      } else if (newOffset < -50) {
        setDirection('left');
      } else {
        setDirection(null);
      }
    }
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      if (offsetX > 100) {
        handleSelect();
      } else if (offsetX < -100) {
        handleReject();
      } else {
        setOffsetX(0);
        setDirection(null);
      }
    }
  };

  const getCardStyle = () => {
    let transform = `translateX(${offsetX}px)`;
    let opacity = 1;
    
    if (direction === 'left') {
      transform = 'translateX(-150%) rotate(-30deg)';
      opacity = 0;
    } else if (direction === 'right') {
      transform = 'translateX(150%) rotate(30deg)';
      opacity = 0;
    } else if (direction === 'undo-left') {
      transform = 'translateX(-150%) rotate(-30deg)';
      opacity = 0;
    } else if (direction === 'undo-right') {
      transform = 'translateX(150%) rotate(30deg)';
      opacity = 0;
    }
    
    return {
      transform,
      opacity,
      transition: direction ? 'transform 0.3s ease, opacity 0.3s ease' : '',
    };
  };

  const handleOpenMessageModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMessageModal(true);
  };

  const handleCloseMessageModal = () => {
    setShowMessageModal(false);
    setMessageText('');
  };

  const handleSendMessage = () => {
    if (messageText.trim() && currentProfile) {
      setSentMessages([...sentMessages, { id: currentProfile.id, message: messageText }]);
      setMessageText('');
      setShowMessageModal(false);
      
      // Show a toast notification
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-out';
      toast.textContent = `Message sent to ${currentProfile.name}`;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 3000);
    }
  };

  const hasMessagedCurrentProfile = currentProfile ? 
    sentMessages.some(msg => msg.id === currentProfile.id) : false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {profiles[0].title.includes("Developer") || profiles[0].title.includes("Engineer") ? (
              <Briefcase className="h-6 w-6 text-indigo-600" />
            ) : (
              <GraduationCap className="h-6 w-6 text-indigo-600" />
            )}
            <h1 className="text-xl font-bold text-gray-800">ProfileReels</h1>
          </div>
          <div className="text-sm text-gray-500">
            {currentIndex + 1} of {profiles.length} profiles
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center justify-center">
        {currentProfile ? (
          <div className="w-full max-w-md">
            {/* Profile Card */}
            <div 
              ref={cardRef}
              className="bg-white rounded-xl shadow-xl overflow-hidden relative"
              style={getCardStyle()}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Swipe Indicators */}
              {direction === 'left' && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full z-10 transform rotate-12">
                  REJECT
                </div>
              )}
              {direction === 'right' && (
                <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full z-10 transform -rotate-12">
                  SELECT
                </div>
              )}

              {/* Message Button */}
              <button 
                onClick={handleOpenMessageModal}
                className={`absolute top-4 right-4 z-10 p-2 rounded-full ${
                  hasMessagedCurrentProfile 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white text-indigo-600 shadow-md'
                }`}
              >
                <MessageCircle className="h-5 w-5" />
              </button>

              {/* Profile Image */}
              <div className="h-64 bg-gray-200">
                <img 
                  src={currentProfile.image} 
                  alt={currentProfile.name} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Profile Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{currentProfile.name}</h2>
                    <p className="text-indigo-600 font-medium">{currentProfile.title}</p>
                  </div>
                  <div className="bg-indigo-100 px-2 py-1 rounded text-indigo-800 text-sm">
                    {currentProfile.experience}
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{currentProfile.bio}</p>

                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentProfile.skills.map((skill, index) => (
                      <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Education</h3>
                  <p className="text-gray-700">{currentProfile.education}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center mt-8 space-x-6">
              <button 
                onClick={handleReject}
                className="bg-white p-4 rounded-full shadow-lg text-red-500 hover:bg-red-50 transition-colors"
              >
                <ThumbsDown className="h-8 w-8" />
              </button>
              
              {/* Undo Button */}
              <button 
                onClick={handleUndo}
                disabled={!canUndo || isUndoing}
                className={`bg-white p-4 rounded-full shadow-lg ${
                  canUndo && !isUndoing 
                    ? 'text-amber-500 hover:bg-amber-50' 
                    : 'text-gray-300 cursor-not-allowed'
                } transition-colors`}
              >
                <Undo2 className="h-8 w-8" />
              </button>
              
              <button 
                onClick={handleSelect}
                className="bg-white p-4 rounded-full shadow-lg text-green-500 hover:bg-green-50 transition-colors"
              >
                <ThumbsUp className="h-8 w-8" />
              </button>
            </div>

            {/* Swipe Instructions */}
            <div className="text-center mt-6 text-gray-500">
              <p>Swipe left to reject, right to select</p>
              <div className="flex justify-center items-center mt-2 space-x-2">
                <ChevronLeft className="h-5 w-5 text-red-400" />
                <span>Reject</span>
                <span className="mx-2">|</span>
                <span>Select</span>
                <ChevronRight className="h-5 w-5 text-green-400" />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No more profiles to review</h2>
            <p className="text-gray-600 mb-6">You've reviewed all available profiles.</p>
            <div className="mb-6">
              <p className="font-medium text-gray-700">Summary:</p>
              <p className="text-green-600">{selectedProfiles.length} profiles selected</p>
              <p className="text-red-600">{rejectedProfiles.length} profiles rejected</p>
              <p className="text-indigo-600 mt-2">{sentMessages.length} messages sent</p>
            </div>
            <button 
              onClick={() => {
                setCurrentIndex(0);
                setSelectedProfiles([]);
                setRejectedProfiles([]);
                setProfileHistory([]);
              }}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Start Over
            </button>
          </div>
        )}
      </main>

      {/* Message Modal */}
      {showMessageModal && currentProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">Message {currentProfile.name}</h3>
              <button onClick={handleCloseMessageModal} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 h-32 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder={`Write a message to ${currentProfile.name}...`}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              ></textarea>
              <div className="flex justify-end mt-4">
                <button 
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className={`px-4 py-2 rounded-lg ${
                    messageText.trim() 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  } transition-colors`}
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white py-4 border-t">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          © 2025 ProfileReels - Streamline your candidate selection process
        </div>
      </footer>

      {/* CSS for toast animation */}
      <style jsx>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(20px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-20px); }
        }
        .animate-fade-in-out {
          animation: fadeInOut 3s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}

export default App;