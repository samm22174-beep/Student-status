   // For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDuoYfArP0-ifxYZ_UKgM7_oAf0dzolANs",
  authDomain: "student-management-syste-b952d.firebaseapp.com",
  databaseURL: "https://student-management-syste-b952d-default-rtdb.firebaseio.com",
  projectId: "student-management-syste-b952d",
  storageBucket: "student-management-syste-b952d.firebasestorage.app",
  messagingSenderId: "116847902508",
  appId: "1:116847902508:web:55c6e02f9c775573357689",
  measurementId: "G-XJLYYQK9VZ"
};



        const firebaseApp = firebase.initializeApp(firebaseConfig);
        const database = firebase.database();
        
        const firebaseDb = {
            getStudents: (callback) => {
                const studentsRef = database.ref('students');
                studentsRef.on('value', (snapshot) => {
                    const data = snapshot.val();
                    const students = data ? Object.keys(data).map(key => ({
                        id: key,
                        ...data[key]
                    })) : [];
                    callback(students);
                });
                return () => studentsRef.off('value');
            }
        };
        
        const BackgroundLines = () => {
            return React.createElement('div', { className: "background-lines" },
                React.createElement('div', { className: "line line-1" }),
                React.createElement('div', { className: "line line-2" }),
                React.createElement('div', { className: "line line-3" }),
                React.createElement('div', { className: "line line-4" }),
                React.createElement('div', { className: "line line-5" }),
                React.createElement('div', { className: "line line-6" }),
                React.createElement('div', { className: "line line-7" }),
                React.createElement('div', { className: "line line-8" })
            );
        };
        
        const AnimatedCounter = ({ value, duration = 1500 }) => {
            const [count, setCount] = React.useState(0);
            
            React.useEffect(() => {
                if (value > 0) {
                    let start = 0;
                    const increment = value / (duration / 16);
                    const timer = setInterval(() => {
                        start += increment;
                        if (start >= value) {
                            setCount(value);
                            clearInterval(timer);
                        } else {
                            setCount(Math.floor(start));
                        }
                    }, 16);
                    return () => clearInterval(timer);
                }
            }, [value, duration]);
            
            return React.createElement('div', { className: "stat-number counter-animation" }, count.toLocaleString());
        };
        
        const StatBox = ({ label, value, subtitle, className = "" }) => {
            return React.createElement('div', { className: `stat-box ${className}` },
                React.createElement('div', { className: "stat-content" },
                    React.createElement('div', { className: "stat-label" }, label),
                    React.createElement(AnimatedCounter, { value: value }),
                    subtitle && React.createElement('div', { className: "stat-subtitle" }, subtitle)
                )
            );
        };
        
        const Loading = () => {
            return React.createElement('div', { className: "loading" },
                React.createElement(BackgroundLines),
                React.createElement('div', { className: "spinner" }),
                React.createElement('div', null, "Loading Student Data...")
            );
        };
        
        const ErrorMessage = ({ message }) => {
            return React.createElement('div', { className: "error" },
                React.createElement(BackgroundLines),
                React.createElement('div', { className: "error-title" }, "Error"),
                React.createElement('div', null, message)
            );
        };
        
        const StudentStatsDashboard = () => {
            const [students, setStudents] = React.useState([]);
            const [loading, setLoading] = React.useState(true);
            const [error, setError] = React.useState(null);
            
            React.useEffect(() => {
                setLoading(true);
                setError(null);
                
                const unsubscribeStudents = firebaseDb.getStudents((studentList) => {
                    setStudents(studentList);
                    setLoading(false);
                });
                
                return () => {
                    unsubscribeStudents && unsubscribeStudents();
                };
            }, []);
            
            const calculateStats = () => {
                if (students.length === 0) {
                    return {
                        total: 0,
                        boys: 0,
                        girls: 0
                    };
                }
                
                const total = students.length;
                const boys = students.filter(s => s.gender === 'Male').length;
                const girls = students.filter(s => s.gender === 'Female').length;
                
                return {
                    total,
                    boys,
                    girls
                };
            };
            
            const stats = calculateStats();
            
            if (loading) {
                return React.createElement(Loading);
            }
            
            if (error) {
                return React.createElement(ErrorMessage, { message: error });
            }
            
            return React.createElement('div', { className: "dashboard" },
                React.createElement(BackgroundLines),
                React.createElement('div', { className: "stats-container" },
                    React.createElement(StatBox, {
                        label: "Total Students",
                        value: stats.total,
                        subtitle: "Enrolled",
                        className: "total-box"
                    }),
                    
                    React.createElement(StatBox, {
                        label: "Boys",
                        value: stats.boys,
                        subtitle: "Male Students",
                        className: "boys-box"
                    }),
                    
                    React.createElement(StatBox, {
                        label: "Girls",
                        value: stats.girls,
                        subtitle: "Female Students",
                        className: "girls-box"
                    })
                )
            );
        };
        
        ReactDOM.render(React.createElement(StudentStatsDashboard), document.getElementById('root'));