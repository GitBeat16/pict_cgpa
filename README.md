# PICT CGPA Calculator & Open House Advisor 🎓

A comprehensive web application designed for PICT (Pune Institute of Computer Technology) students to calculate their CGPA using the official PICT grading system and receive personalized Open House recommendations based on their academic performance.

## Features

### 1. **CGPA Calculator with PICT Grading System**
- Calculate CGPA across multiple semesters
- Add subjects with credits and marks (0-100) for each semester
- Automatic grade calculation based on PICT grading policy
- View semester-wise SGPA breakdown
- Performance rating based on CGPA
- Real-time calculations

### 2. **Official PICT Grading Policy**
- **O** (Outstanding): 85-100 marks → 10 GP
- **A+** (Excellent): 75-84.99 marks → 9 GP
- **A** (Very Good): 65-74.99 marks → 8 GP
- **B+** (Good): 55-64.99 marks → 7 GP
- **B** (Satisfactory): 50-54.99 marks → 6 GP
- **C** (Average): 40-49.99 marks → 5 GP
- **P** (Pass): 35-39.99 marks → 4 GP
- **F** (Fail): 0-34.99 marks → 0 GP

### 3. **Open House Advisor**
- Get company recommendations based on your CGPA
- View companies in different tiers:
  - **Premium (≥8.5)**: Google, Microsoft, Meta, Amazon, Apple, Tesla
  - **High-Tier (7.5-8.4)**: Flipkart, Swiggy, Paytm, Zomato, OYO, Adobe, Morgan Stanley
  - **Mid-Tier (7.0-7.4)**: TCS, Infosys, Wipro, Cognizant, Capgemini, Accenture, HCL
  - **Starter (<7.0)**: Tech Mahindra, Mindtree, Hexaware, Virtusa, UST Global, Persistent Systems
- View CTC ranges and job packages for each company
- Motivational messages based on your CGPA and semester

### 4. **Results History**
- Automatically saves your calculation history
- View up to 10 most recent calculations
- Clear history with one click
- Persistent storage using browser's localStorage

## How to Use

### Getting Started
1. Open `index.html` in your web browser
2. You'll see four tabs: Calculator, Grading System, Advisor, and History

### CGPA Calculator Tab
1. Enter the number of semesters you want to calculate
2. Click "Generate" to create semester blocks
3. For each semester:
   - Enter subject names
   - Enter credit hours
   - Enter marks (0-100)
   - Click "+ Add Subject" to add more subjects
   - Click "×" button to remove a subject
4. Click "Calculate CGPA" to see your results
5. View your CGPA, total credits, and semester-wise breakdown

### Grading System Tab
- View the official PICT grading policy table
- Understand grade points for each grade
- Reference marks ranges for each grade

### Open House Advisor Tab
1. Enter your current CGPA
2. Select your current semester
3. Click "Get Recommendations"
4. View recommended companies with CTC and package information

### Results History Tab
- View all your previous calculations
- See the date, semester count, and CGPA for each calculation
- Click "Clear History" to remove all stored calculations

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Storage**: Browser's localStorage API
- **Responsive Design**: Mobile-friendly and desktop optimized
- **Grading System**: Integrated from @SameepM04/cgpafy

## File Structure

```
pict_cgpa/
├── index.html      # Main HTML structure
├── styles.css      # Complete styling and responsive design
├── script.js       # JavaScript logic and calculations
└── README.md       # This file
```

## Key Functions

### CGPA Calculation
- Calculates weighted average of all subjects
- Formula: CGPA = (Σ Credits × Grade Points) / Σ Credits
- Automatic SGPA calculation for each semester
- Uses official PICT grading policy

### Performance Rating System
- **Excellent (9+)**: 🌟
- **Outstanding (8.5-8.9)**: ⭐
- **Very Good (8-8.4)**: 👍
- **Good (7.5-7.9)**: ✓
- **Satisfactory (7-7.4)**: Neutral
- **Average (6-6.9)**: Neutral
- **Needs Improvement (<6)**: Attention needed

## Data Persistence

All calculation history is automatically saved to your browser's localStorage, meaning:
- Your data persists even after closing the browser
- History is stored locally on your device
- No data is sent to external servers
- Clearing browser data will remove the history

## Performance Tips

1. **For accurate CGPA**: Ensure all credits and marks are entered correctly
2. **Adding subjects**: Start with typical subjects per semester, add more as needed
3. **Marks accuracy**: Use your exact marks, typically on a 0-100 scale at PICT
4. **Open House preparation**: Check company requirements regularly and aim to improve your CGPA

## Company Database

The app includes realistic company information based on:
- Historical placement data from PICT
- Typical CGPA cutoffs at PICT
- Approximate CTC ranges (can vary based on experience)
- Common packages offered at PICT

*Note: This information is for reference only. Actual company requirements and CTCs may vary.*

## Browser Compatibility

- Chrome/Chromium (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

- [ ] Export calculations as PDF
- [ ] Compare CGPA with class average
- [ ] Interview preparation tips based on CGPA tier
- [ ] Company salary trend analysis
- [ ] Multiple profile support
- [ ] Dark mode theme
- [ ] Subject-wise analytics

## Tips for PICT Students

1. **Early Semesters**: Focus on building strong fundamentals to maintain high CGPA
2. **Internships**: Companies prefer students with 7.5+ CGPA for quality internships
3. **Open House**: Register early for companies you're interested in
4. **Technical Skills**: CGPA alone isn't enough - develop programming skills parallel to studies
5. **Resume**: Highlight projects, achievements beyond just CGPA

## Credits

- Grading System based on @SameepM04/cgpafy
- Built for PICT students by PICT enthusiasts

## Feedback & Support

For issues, suggestions, or improvements, feel free to create an issue in the repository.

---

**Made for PICT Students by PICT Students** 💜

*Last Updated: 2026*