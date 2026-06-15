// ==================== GRADING POLICY DATA ====================
const GRADING_POLICY = [
    { grade: 'O', min: 85, max: 100, gp: 10, description: 'Outstanding' },
    { grade: 'A+', min: 75, max: 84.99, gp: 9, description: 'Excellent' },
    { grade: 'A', min: 65, max: 74.99, gp: 8, description: 'Very Good' },
    { grade: 'B+', min: 55, max: 64.99, gp: 7, description: 'Good' },
    { grade: 'B', min: 50, max: 54.99, gp: 6, description: 'Satisfactory' },
    { grade: 'C', min: 40, max: 49.99, gp: 5, description: 'Average' },
    { grade: 'P', min: 35, max: 39.99, gp: 4, description: 'Pass' },
    { grade: 'F', min: 0, max: 34.99, gp: 0, description: 'Fail' }
];

// ==================== CGPA CALCULATION LOGIC ====================
let calculationHistory = JSON.parse(localStorage.getItem('cgpaHistory')) || [];

// Company database for Open House recommendations
const openHouseCompanies = {
    premium: {
        name: 'Premium Companies (CGPA ≥ 8.5)',
        companies: [
            { name: 'Google', ctc: '₹60-80 LPA', packages: 'SWE, APM, Business Analyst' },
            { name: 'Microsoft', ctc: '₹50-75 LPA', packages: 'Software Engineer, Cloud Architect' },
            { name: 'Meta', ctc: '₹65-85 LPA', packages: 'Software Engineer, Product Manager' },
            { name: 'Amazon', ctc: '₹50-70 LPA', packages: 'SDE, PM, Data Scientist' },
            { name: 'Apple', ctc: '₹55-75 LPA', packages: 'Software Engineer, Hardware Engineer' },
            { name: 'Tesla', ctc: '₹50-70 LPA', packages: 'Software Engineer, Embedded Systems' }
        ]
    },
    highTier: {
        name: 'High-Tier Companies (CGPA 7.5 - 8.4)',
        companies: [
            { name: 'Flipkart', ctc: '₹35-55 LPA', packages: 'SDE, Data Engineer, DevOps' },
            { name: 'Swiggy', ctc: '₹30-50 LPA', packages: 'Backend Engineer, Full Stack' },
            { name: 'Paytm', ctc: '₹28-48 LPA', packages: 'Software Engineer, Payment Systems' },
            { name: 'Zomato', ctc: '₹30-50 LPA', packages: 'Backend, Frontend, DevOps Engineer' },
            { name: 'OYO', ctc: '₹25-45 LPA', packages: 'Full Stack, Mobile Engineer' },
            { name: 'Adobe', ctc: '₹40-60 LPA', packages: 'Software Engineer, UX Engineer' },
            { name: 'Morgan Stanley', ctc: '₹35-55 LPA', packages: 'Software Engineer, Trading Systems' }
        ]
    },
    midTier: {
        name: 'Mid-Tier Companies (CGPA 7.0 - 7.4)',
        companies: [
            { name: 'TCS', ctc: '₹12-18 LPA', packages: 'Software Engineer, System Engineer' },
            { name: 'Infosys', ctc: '₹12-18 LPA', packages: 'Software Engineer, Software Developer' },
            { name: 'Wipro', ctc: '₹12-18 LPA', packages: 'Project Engineer, Software Engineer' },
            { name: 'Cognizant', ctc: '₹15-22 LPA', packages: 'Programmer Analyst, Software Developer' },
            { name: 'Capgemini', ctc: '₹14-20 LPA', packages: 'Software Engineer, Technology Analyst' },
            { name: 'Accenture', ctc: '₹14-20 LPA', packages: 'Software Engineer, Cloud Engineer' },
            { name: 'HCL', ctc: '₹12-18 LPA', packages: 'Software Engineer, System Engineer' }
        ]
    },
    starter: {
        name: 'Starter Companies (CGPA < 7.0)',
        companies: [
            { name: 'Tech Mahindra', ctc: '₹10-16 LPA', packages: 'Software Engineer, Associate Engineer' },
            { name: 'Mindtree', ctc: '₹11-17 LPA', packages: 'Software Engineer, Technology Associate' },
            { name: 'Hexaware', ctc: '₹10-15 LPA', packages: 'Software Engineer, Associate' },
            { name: 'Virtusa', ctc: '₹10-16 LPA', packages: 'Engineer, Software Developer' },
            { name: 'Ust Global', ctc: '₹10-15 LPA', packages: 'Software Engineer, Associate Consultant' },
            { name: 'Persistent Systems', ctc: '₹10-16 LPA', packages: 'Software Engineer, Developer' }
        ]
    }
};

// ==================== TAB SWITCHING ====================
function switchTab(tabName) {
    // Hide all tab contents
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active'));

    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    // Show selected tab and mark button as active
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');

    // Load content when switching tabs
    if (tabName === 'history') {
        loadHistory();
    } else if (tabName === 'grading') {
        loadGradingTable();
    }
}

// ==================== GRADING TABLE ====================
function loadGradingTable() {
    const container = document.getElementById('gradingTable');
    let html = '<table class="grading-table"><thead><tr>';
    html += '<th>Grade</th><th>Marks Range</th><th>Grade Points (GP)</th><th>Description</th>';
    html += '</tr></thead><tbody>';

    GRADING_POLICY.forEach(item => {
        html += `<tr>
            <td><span class="grade-code">${item.grade}</span></td>
            <td>${item.min} - ${item.max}</td>
            <td><strong>${item.gp}</strong></td>
            <td>${item.description}</td>
        </tr>`;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

function getGradeFromMarks(marks) {
    if (isNaN(marks)) return null;
    
    for (let policy of GRADING_POLICY) {
        if (marks >= policy.min && marks <= policy.max) {
            return policy;
        }
    }
    return null;
}

// ==================== SEMESTER INPUTS GENERATION ====================
function generateSemesterInputs() {
    const semesterCount = parseInt(document.getElementById('semesterCount').value);
    const container = document.getElementById('semesterInputs');
    container.innerHTML = '';

    for (let sem = 1; sem <= semesterCount; sem++) {
        const semesterBlock = document.createElement('div');
        semesterBlock.className = 'semester-block';
        semesterBlock.id = `semester-${sem}`;
        
        let html = `<h3>Semester ${sem}</h3>`;
        
        // Add 5 default subject inputs
        for (let i = 0; i < 5; i++) {
            html += `
                <div class="subject-input">
                    <input type="text" placeholder="Subject Name" class="subject-name" data-sem="${sem}" data-idx="${i}">
                    <input type="number" placeholder="Credits" min="0" max="10" step="0.5" class="subject-credits" data-sem="${sem}" data-idx="${i}">
                    <input type="number" placeholder="Marks (0-100)" min="0" max="100" step="0.1" class="subject-marks" data-sem="${sem}" data-idx="${i}">
                    <button type="button" class="remove-subject" onclick="removeSubject(${sem}, ${i})" style="display: ${i === 0 ? 'none' : 'block'};">×</button>
                </div>
            `;
        }
        
        html += `<button type="button" class="add-subject-btn" onclick="addSubject(${sem})">+ Add Subject</button>`;
        semesterBlock.innerHTML = html;
        container.appendChild(semesterBlock);
    }
}

function addSubject(semesterNum) {
    const semesterBlock = document.getElementById(`semester-${semesterNum}`);
    const inputs = semesterBlock.querySelectorAll('.subject-input');
    const newIndex = inputs.length;

    const newInput = document.createElement('div');
    newInput.className = 'subject-input';
    newInput.innerHTML = `
        <input type="text" placeholder="Subject Name" class="subject-name" data-sem="${semesterNum}" data-idx="${newIndex}">
        <input type="number" placeholder="Credits" min="0" max="10" step="0.5" class="subject-credits" data-sem="${semesterNum}" data-idx="${newIndex}">
        <input type="number" placeholder="Marks (0-100)" min="0" max="100" step="0.1" class="subject-marks" data-sem="${semesterNum}" data-idx="${newIndex}">
        <button type="button" class="remove-subject" onclick="removeSubject(${semesterNum}, ${newIndex})">×</button>
    `;

    const addBtn = semesterBlock.querySelector('.add-subject-btn');
    semesterBlock.insertBefore(newInput, addBtn);
}

function removeSubject(semesterNum, idx) {
    const input = document.querySelector(`[data-sem="${semesterNum}"][data-idx="${idx}"]`).closest('.subject-input');
    input.remove();
}

// ==================== CGPA CALCULATION ====================
function calculateCGPA() {
    const semesterCount = parseInt(document.getElementById('semesterCount').value);
    let totalCredits = 0;
    let totalGradePoints = 0;
    let semesterData = [];
    let hasError = false;

    // Collect data from all semesters
    for (let sem = 1; sem <= semesterCount; sem++) {
        const semesterBlock = document.getElementById(`semester-${sem}`);
        const inputs = semesterBlock.querySelectorAll('.subject-input');
        let semCredits = 0;
        let semGradePoints = 0;
        let semCount = 0;
        let semesterSubjects = [];

        inputs.forEach((input, idx) => {
            const name = input.querySelector('.subject-name').value.trim();
            const credits = parseFloat(input.querySelector('.subject-credits').value);
            const marks = parseFloat(input.querySelector('.subject-marks').value);

            // Validate inputs
            if (name && !isNaN(credits) && !isNaN(marks)) {
                if (credits <= 0 || marks < 0 || marks > 100) {
                    alert('Please enter valid credits (> 0) and marks (0-100)');
                    hasError = true;
                    return;
                }
                
                const gradeInfo = getGradeFromMarks(marks);
                if (!gradeInfo) {
                    alert('Invalid marks range');
                    hasError = true;
                    return;
                }

                semesterSubjects.push({ 
                    name, 
                    credits, 
                    marks,
                    grade: gradeInfo.grade,
                    gp: gradeInfo.gp
                });
                semCredits += credits;
                semGradePoints += credits * gradeInfo.gp;
                semCount++;
                totalCredits += credits;
                totalGradePoints += credits * gradeInfo.gp;
            }
        });

        if (semCount > 0) {
            semesterData.push({
                semester: sem,
                sgpa: (semGradePoints / semCredits).toFixed(2),
                credits: semCredits,
                subjects: semesterSubjects
            });
        }
    }

    if (hasError || totalCredits === 0) {
        alert('Please enter at least one subject with valid credits and marks');
        return;
    }

    const cgpa = (totalGradePoints / totalCredits).toFixed(2);

    // Display results
    displayCGPAResult(cgpa, semesterData, totalCredits);

    // Save to history
    saveToHistory(cgpa, semesterData);
}

function displayCGPAResult(cgpa, semesterData, totalCredits) {
    const resultDiv = document.getElementById('result');
    const resultContent = document.getElementById('resultContent');

    let html = `
        <div class="cgpa-display">CGPA: ${cgpa}</div>
        <div class="result-stats">
            <div class="stat-item">
                <div class="stat-label">Total Credits</div>
                <div class="stat-value">${totalCredits.toFixed(2)}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Performance</div>
                <div class="stat-value ${getPerformanceClass(cgpa)}">${getPerformanceText(cgpa)}</div>
            </div>
        </div>
        <div style="margin-top: 20px;">
            <h4>Semester-wise SGPA</h4>
    `;

    semesterData.forEach(sem => {
        html += `
            <div class="stat-item" style="margin-top: 10px; text-align: left;">
                <strong>Semester ${sem.semester}:</strong> SGPA: ${sem.sgpa} | Credits: ${sem.credits}
            </div>
        `;
    });

    html += `</div>`;
    resultContent.innerHTML = html;
    resultDiv.style.display = 'block';

    // Scroll to result
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

function getPerformanceText(cgpa) {
    const value = parseFloat(cgpa);
    if (value >= 9) return 'Excellent 🌟';
    if (value >= 8.5) return 'Outstanding ⭐';
    if (value >= 8) return 'Very Good 👍';
    if (value >= 7.5) return 'Good ✓';
    if (value >= 7) return 'Satisfactory';
    if (value >= 6) return 'Average';
    return 'Needs Improvement';
}

function getPerformanceClass(cgpa) {
    const value = parseFloat(cgpa);
    if (value >= 8.5) return 'success';
    if (value >= 7.5) return 'info';
    if (value >= 7) return 'warning';
    return 'error';
}

function resetCalculator() {
    document.getElementById('semesterInputs').innerHTML = '';
    document.getElementById('result').style.display = 'none';
    document.getElementById('semesterCount').value = '1';
}

// ==================== OPEN HOUSE ADVISOR ====================
function getOpenHouseAdvice() {
    const cgpa = parseFloat(document.getElementById('cgpaInput').value);
    const semester = parseInt(document.getElementById('semesterSelect').value);

    if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
        alert('Please enter a valid CGPA between 0 and 10');
        return;
    }

    let tier;
    if (cgpa >= 8.5) tier = 'premium';
    else if (cgpa >= 7.5) tier = 'highTier';
    else if (cgpa >= 7.0) tier = 'midTier';
    else tier = 'starter';

    displayAdvice(cgpa, semester, tier);
}

function displayAdvice(cgpa, semester, tier) {
    const adviceDiv = document.getElementById('adviceResult');
    const adviceContent = document.getElementById('adviceContent');
    const tierData = openHouseCompanies[tier];

    let html = `
        <div class="info" style="margin-bottom: 20px;">
            <strong>Your CGPA: ${cgpa} | Semester: ${semester}</strong>
            <p>${getMotivationalMessage(cgpa, semester)}</p>
        </div>
        <h4>${tierData.name}</h4>
        <div class="company-list">
    `;

    tierData.companies.forEach(company => {
        html += `
            <div class="company-card">
                <h4>${company.name}</h4>
                <p><strong>CTC:</strong> ${company.ctc}</p>
                <p><strong>Packages:</strong> ${company.packages}</p>
                <span class="cgpa-range">Expected CGPA: ${tier === 'premium' ? '8.5+' : tier === 'highTier' ? '7.5-8.4' : tier === 'midTier' ? '7.0-7.4' : '<7.0'}</span>
            </div>
        `;
    });

    html += `</div>`;
    adviceContent.innerHTML = html;
    adviceDiv.style.display = 'block';

    adviceDiv.scrollIntoView({ behavior: 'smooth' });
}

function getMotivationalMessage(cgpa, semester) {
    const value = parseFloat(cgpa);
    let message = '';

    if (value >= 8.5) {
        message = '🎉 Excellent work! You are eligible for premium companies like Google, Microsoft, Meta, and Amazon.';
    } else if (value >= 7.5) {
        message = '⭐ Great performance! You have access to high-tier companies and can crack interviews with focused preparation.';
    } else if (value >= 7.0) {
        message = '✓ Good progress! Keep improving your CGPA and build strong technical skills. You have good company options.';
    } else {
        message = '💪 Keep working hard! Focus on improving your CGPA. Start with core companies and gradually aim higher.';
    }

    if (semester <= 4) {
        message += ' You still have time to improve your academic performance!';
    } else {
        message += ' Make the most of your final semesters to strengthen your profile!';
    }

    return message;
}

// ==================== HISTORY MANAGEMENT ====================
function saveToHistory(cgpa, semesterData) {
    const entry = {
        cgpa: cgpa,
        date: new Date().toLocaleString(),
        semesters: semesterData.length,
        totalCredits: semesterData.reduce((sum, sem) => sum + sem.credits, 0)
    };

    calculationHistory.unshift(entry);
    if (calculationHistory.length > 10) {
        calculationHistory.pop();
    }

    localStorage.setItem('cgpaHistory', JSON.stringify(calculationHistory));
}

function loadHistory() {
    const historyContent = document.getElementById('historyContent');

    if (calculationHistory.length === 0) {
        historyContent.innerHTML = '<p class="empty-message">No calculations yet. Start by calculating your CGPA!</p>';
        return;
    }

    let html = '';
    calculationHistory.forEach((entry, index) => {
        html += `
            <div class="history-item">
                <div class="history-details">
                    <h4>Calculation ${index + 1}</h4>
                    <p class="history-date">${entry.date}</p>
                    <small>${entry.semesters} semester(s) • ${entry.totalCredits.toFixed(2)} total credits</small>
                </div>
                <div class="history-cgpa">${entry.cgpa}</div>
            </div>
        `;
    });

    historyContent.innerHTML = html;
}

function clearHistory() {
    if (confirm('Are you sure you want to clear all history?')) {
        calculationHistory = [];
        localStorage.removeItem('cgpaHistory');
        loadHistory();
    }
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    // Generate initial semester inputs
    generateSemesterInputs();
});