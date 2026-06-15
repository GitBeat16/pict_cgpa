// Global state
let coursesData = {
    semester_1: [],
    semester_2: []
};

let currentCalculation = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadCourses();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', switchTab);
    });

    // Action buttons
    document.getElementById('calculate-btn').addEventListener('click', calculateResults);
    document.getElementById('save-btn').addEventListener('click', saveData);
    document.getElementById('load-btn').addEventListener('click', loadData);
    document.getElementById('export-btn').addEventListener('click', exportPDF);
    document.getElementById('reset-btn').addEventListener('click', resetData);

    // Input validation for marks
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('marks-input')) {
            handleMarkInput(e.target);
        }
    });
}

// Load courses from backend
async function loadCourses() {
    try {
        const response = await fetch('/api/courses');
        const data = await response.json();
        
        coursesData = data;
        renderCourses('semester_1', data.semester_1);
        renderCourses('semester_2', data.semester_2);
    } catch (error) {
        showToast('Error loading courses', 'error');
        console.error('Error:', error);
    }
}

// Render courses in grid
function renderCourses(semester, courses) {
    const containerId = semester === 'semester_1' ? 'sem1-courses' : 'sem2-courses';
    const container = document.getElementById(containerId);
    
    container.innerHTML = '';
    
    courses.forEach((course, index) => {
        const courseCard = createCourseCard(course, semester, index);
        container.appendChild(courseCard);
    });
}

// Create course card element
function createCourseCard(course, semester, index) {
    const card = document.createElement('div');
    card.className = 'course-card';
    
    const marks = course.marks || '';
    let gradeHTML = '';
    
    if (marks !== '') {
        const percentage = (marks / course.max_marks) * 100;
        const gradeInfo = getGradeInfo(percentage);
        gradeHTML = `<div class="course-grade ${getGradeClass(gradeInfo.points)}">${gradeInfo.grade}</div>`;
    }
    
    card.innerHTML = `
        <div class="course-header">
            <span class="course-code">${course.code}</span>
            <div class="course-name">${course.name}</div>
            <div class="course-meta">
                <span>💳 ${course.credits} Credits</span>
                <span>📈 ${course.max_marks} Max</span>
            </div>
        </div>
        <div class="marks-input-group">
            <label>Enter Marks</label>
            <div class="input-wrapper">
                <input 
                    type="number" 
                    class="marks-input" 
                    data-semester="${semester}" 
                    data-index="${index}"
                    value="${marks}"
                    min="0"
                    max="${course.max_marks}"
                    placeholder="0"
                >
                <div class="max-marks">${course.max_marks}</div>
            </div>
            ${gradeHTML}
        </div>
    `;
    
    return card;
}

// Handle mark input
function handleMarkInput(input) {
    const semester = input.dataset.semester;
    const index = parseInt(input.dataset.index);
    const marks = input.value ? parseFloat(input.value) : '';
    
    // Update course data
    coursesData[semester][index].marks = marks !== '' ? marks : '';
    
    // Update grade display
    const course = coursesData[semester][index];
    const gradeContainer = input.closest('.marks-input-group');
    const existingGrade = gradeContainer.querySelector('.course-grade');
    
    if (existingGrade) {
        existingGrade.remove();
    }
    
    if (marks !== '' && marks >= 0 && marks <= course.max_marks) {
        const percentage = (marks / course.max_marks) * 100;
        const gradeInfo = getGradeInfo(percentage);
        const gradeHTML = `<div class="course-grade ${getGradeClass(gradeInfo.points)}">${gradeInfo.grade}</div>`;
        gradeContainer.insertAdjacentHTML('beforeend', gradeHTML);
    }
}

// Get grade info based on percentage
function getGradeInfo(percentage) {
    const grades = [
        { min: 90, max: 100, points: 10, grade: 'O' },
        { min: 80, max: 89.99, points: 9, grade: 'A+' },
        { min: 70, max: 79.99, points: 8, grade: 'A' },
        { min: 60, max: 69.99, points: 7, grade: 'B+' },
        { min: 50, max: 59.99, points: 6, grade: 'B' },
        { min: 44, max: 49.99, points: 5, grade: 'C' },
        { min: 40, max: 43.99, points: 4, grade: 'P' },
        { min: 0, max: 39.99, points: 0, grade: 'F' },
    ];
    
    for (let grade of grades) {
        if (percentage >= grade.min && percentage <= grade.max) {
            return grade;
        }
    }
    
    return { points: 0, grade: 'F' };
}

// Get grade CSS class
function getGradeClass(points) {
    if (points >= 8) return 'success';
    if (points >= 6) return 'warning';
    return 'danger';
}

// Calculate SGPA
function calculateSGPA(courses) {
    let totalPoints = 0;
    let totalCredits = 0;
    
    courses.forEach(course => {
        const marks = course.marks;
        if (marks !== '' && marks !== undefined && marks !== null) {
            const percentage = (marks / course.max_marks) * 100;
            const gradeInfo = getGradeInfo(percentage);
            
            if (gradeInfo.points !== null && gradeInfo.points !== undefined) {
                totalPoints += gradeInfo.points * course.credits;
                totalCredits += course.credits;
            }
        }
    });
    
    if (totalCredits === 0) return 0;
    return (totalPoints / totalCredits).toFixed(2);
}

// Calculate results
async function calculateResults() {
    try {
        const response = await fetch('/api/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(coursesData)
        });
        
        const result = await response.json();
        currentCalculation = result;
        
        // Update results display
        displayResults(result);
        
        showToast('Results calculated successfully!', 'success');
        switchTab({ target: { dataset: { tab: 'results' } } });
    } catch (error) {
        showToast('Error calculating results', 'error');
        console.error('Error:', error);
    }
}

// Display results
function displayResults(result) {
    // Update SGPA and CGPA cards
    document.getElementById('sgpa1').textContent = result.sgpa_1;
    document.getElementById('sgpa2').textContent = result.sgpa_2;
    document.getElementById('cgpa').textContent = result.cgpa;
    
    // Add grade descriptions
    document.getElementById('sgpa1-details').textContent = getGradeLabel(result.sgpa_1);
    document.getElementById('sgpa2-details').textContent = getGradeLabel(result.sgpa_2);
    
    // Display detailed results tables
    displayDetailedResults('semester_1');
    displayDetailedResults('semester_2');
    
    // Display open house recommendations
    displayOpenHouseRecommendations(result);
}

// Get grade label based on SGPA
function getGradeLabel(sgpa) {
    if (sgpa >= 9) return 'Excellent';
    if (sgpa >= 8) return 'Very Good';
    if (sgpa >= 7) return 'Good';
    if (sgpa >= 6) return 'Above Average';
    if (sgpa >= 5) return 'Average';
    if (sgpa >= 4) return 'Pass';
    return 'Need Improvement';
}

// Display detailed results table
function displayDetailedResults(semester) {
    const courses = coursesData[semester];
    const tableId = semester === 'semester_1' ? 'sem1-results-table' : 'sem2-results-table';
    const tbody = document.querySelector(`#${tableId} tbody`);
    
    tbody.innerHTML = '';
    
    courses.forEach(course => {
        const marks = course.marks;
        
        if (marks !== '' && marks !== undefined && marks !== null) {
            const percentage = (marks / course.max_marks) * 100;
            const gradeInfo = getGradeInfo(percentage);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${course.code}</td>
                <td>${course.name}</td>
                <td>${course.credits}</td>
                <td>${marks}</td>
                <td>${percentage.toFixed(2)}%</td>
                <td>${gradeInfo.grade}</td>
                <td>${gradeInfo.points}</td>
            `;
            
            tbody.appendChild(row);
        }
    });
}

// Display open house recommendations
function displayOpenHouseRecommendations(result) {
    const container = document.getElementById('open-house-benefits');
    const banner = document.getElementById('open-house-recommendation');
    
    container.innerHTML = '';
    banner.classList.remove('show', 'recommended', 'not-recommended');
    
    if (result.benefit_count === 0) {
        banner.innerHTML = '✓ Great! You\'ve reached optimal grades in all courses. No open house negotiation needed!';
        banner.classList.add('show', 'not-recommended');
        
        container.innerHTML = '<div class="no-benefits">No courses available for improvement through open house negotiation.</div>';
    } else {
        banner.innerHTML = `🎯 Opportunity Detected! You have ${result.benefit_count} course(s) where 2-3 additional marks could improve your grade. Consider attending open house!`;
        banner.classList.add('show', 'recommended');
        
        result.open_house_benefits.forEach(benefit => {
            const card = document.createElement('div');
            card.className = 'benefit-card';
            card.innerHTML = `
                <h4>${benefit.name}</h4>
                <span class="benefit-code">${benefit.code}</span>
                <div class="benefit-details">
                    <div class="benefit-detail">
                        <div class="benefit-detail-label">Current</div>
                        <div class="benefit-detail-value">${benefit.current_marks}/${benefit.current_grade}</div>
                    </div>
                    <div class="benefit-detail">
                        <div class="benefit-detail-label">Potential (+2-3 marks)</div>
                        <div class="benefit-detail-value">${benefit.potential_marks}/${benefit.potential_grade}</div>
                    </div>
                </div>
            `;
            
            container.appendChild(card);
        });
    }
}

// Save data
async function saveData() {
    try {
        const response = await fetch('/api/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(coursesData)
        });
        
        const result = await response.json();
        showToast('Data saved successfully!', 'success');
    } catch (error) {
        showToast('Error saving data', 'error');
        console.error('Error:', error);
    }
}

// Load data
async function loadData() {
    try {
        const response = await fetch('/api/load');
        const data = await response.json();
        
        coursesData = data;
        renderCourses('semester_1', data.semester_1);
        renderCourses('semester_2', data.semester_2);
        
        showToast('Data loaded successfully!', 'success');
    } catch (error) {
        showToast('Error loading data', 'error');
        console.error('Error:', error);
    }
}

// Export to PDF
async function exportPDF() {
    try {
        const response = await fetch('/api/export-pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(coursesData)
        });
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CGPA_Report_${new Date().toLocaleDateString()}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        showToast('PDF exported successfully!', 'success');
    } catch (error) {
        showToast('Error exporting PDF', 'error');
        console.error('Error:', error);
    }
}

// Reset data
function resetData() {
    if (confirm('Are you sure you want to reset all marks? This cannot be undone.')) {
        coursesData.semester_1.forEach(course => course.marks = '');
        coursesData.semester_2.forEach(course => course.marks = '');
        
        renderCourses('semester_1', coursesData.semester_1);
        renderCourses('semester_2', coursesData.semester_2);
        
        showToast('All data has been reset', 'info');
    }
}

// Switch tabs
function switchTab(e) {
    const tabName = e.target.dataset.tab;
    
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Add active class to clicked button
    e.target.classList.add('active');
}

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Auto-calculate on input
document.addEventListener('input', function(e) {
    if (e.target.classList.contains('marks-input')) {
        // Debounce auto-calculation
        clearTimeout(window.autoCalcTimeout);
        window.autoCalcTimeout = setTimeout(() => {
            // Optional: you can enable auto-calculation here
            // calculateResults();
        }, 1000);
    }
});
