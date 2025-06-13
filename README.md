# TJ Clays Limited - Production Dashboard

A modern, responsive web dashboard for displaying daily production reports and key performance indicators for TJ Clays Limited's manufacturing operations.

![Dashboard Preview](https://img.shields.io/badge/Status-Live-brightgreen) ![License](https://img.shields.io/badge/License-MIT-blue) ![Version](https://img.shields.io/badge/Version-1.0-orange)

## 🚀 Features

- **Real-time Data Loading** - Automatically reads from CSV files
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Modern UI** - Clean, professional interface with smooth animations
- **Key Metrics Tracking** - Production quantities, targets, and variances
- **Performance KPIs** - On-time and in-full delivery tracking
- **Auto-refresh** - Updates every 5 minutes automatically
- **Excel Date Support** - Converts Excel serial dates to readable format

## 📊 Dashboard Sections

### Production Metrics
- **Conventional Books** - Daily and monthly production tracking
- **Print on Demand (POD)** - Volume and performance metrics
- **Personalised Books** - Custom production monitoring
- **Clays Trade** - Trade operations tracking

### Key Performance Indicators
- **On Time Performance** - Delivery punctuality by product line
- **In Full Performance** - Order completion rates
- **Summary Statistics** - Total units and operational hours

## 🛠 Setup Instructions

### Prerequisites
- GitHub account
- Basic understanding of Git (optional)

### Quick Start

1. **Fork or Download** this repository
2. **Upload your data file** as `dailyproduction.csv` to the root directory
3. **Enable GitHub Pages**:
   - Go to repository Settings
   - Navigate to Pages section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Save changes

4. **Access your dashboard** at: `https://yourusername.github.io/repository-name`

### File Structure
```
tj-clays-dashboard/
├── index.html              # Main dashboard file
├── dailyproduction.csv     # Daily production data
├── README.md              # This file
└── .gitignore             # Git ignore file (optional)
```

## 📁 Data Format

### CSV File Requirements

Your `dailyproduction.csv` should follow this structure:

```csv
TJ Clays Limited t/a TJ Books
Daily production report
June
45820,Thursday
,,12,45809,,154,165
...
```

**Important Notes:**
- Keep the exact CSV structure from your Excel export
- Date should be in Excel serial format (automatically converted)
- File must be named exactly `dailyproduction.csv`
- Ensure all numeric data is properly formatted

### Supported Data Fields
- Production quantities (Actual, Target, Variance)
- Resource allocation (Heads, Hours, Per paid hour)
- On-time performance metrics
- In-full delivery statistics
- Date information (Excel serial dates supported)

## 🔄 Daily Updates

### Manual Process
1. Export your daily Excel report to CSV format
2. Replace the existing `dailyproduction.csv` file in your repository
3. Commit and push changes to GitHub
4. Dashboard will automatically refresh with new data

### Automated Process (Advanced)
You can set up GitHub Actions to automatically update data:

```yaml
# .github/workflows/update-data.yml
name: Update Production Data
on:
  schedule:
    - cron: '0 9 * * 1-5'  # 9 AM weekdays
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Update data
        run: |
          # Add your automation scripts here
```

## 🎨 Customization

### Color Schemes
The dashboard uses a professional grey gradient theme. You can customize colors by modifying the CSS variables in `index.html`:

```css
/* Main background gradient */
background: linear-gradient(135deg, #718096 0%, #4A5568 100%);

/* Product line colors */
.conventional { border-left-color: #e74c3c; } /* Red */
.pod { border-left-color: #f39c12; }         /* Orange */
.personalized { border-left-color: #9b59b6; } /* Purple */
.trade { border-left-color: #1abc9c; }       /* Teal */
```

### Adding New Metrics
To add new production lines or metrics:

1. Update the CSV parsing function in `index.html`
2. Add new metric cards to the dashboard
3. Include the data in your CSV file

## 🔧 Troubleshooting

### Common Issues

**Dashboard not loading data:**
- Check that `dailyproduction.csv` exists in the root directory
- Verify the CSV file is properly formatted
- Ensure GitHub Pages is enabled
- Check browser console for error messages

**Date showing as numbers:**
- This is normal - Excel serial dates are automatically converted
- Number `45820` becomes "Thursday 12th June 2025"

**CSV file not found:**
- File must be named exactly `dailyproduction.csv` (case sensitive)
- File should be in the same directory as `index.html`
- Check that the file was properly committed to GitHub

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers supported
- Requires JavaScript enabled

## 📱 Mobile Support

The dashboard is fully responsive and optimized for:
- Desktop computers (1200px+)
- Tablets (768px - 1199px)
- Mobile phones (up to 767px)

Features automatically adapt:
- Grid layouts stack on smaller screens
- Font sizes adjust for readability
- Touch-friendly interface elements

## 🚀 Performance

- **Load Time**: < 2 seconds (depending on CSV size)
- **Auto-refresh**: Every 5 minutes
- **Data Processing**: Client-side JavaScript
- **Hosting**: GitHub Pages (free)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/improvement`)
5. Create a Pull Request

## 📞 Support

For issues or questions:
- Create an issue in this repository
- Check the troubleshooting section above
- Review the CSV format requirements

## 🔗 Links

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [CSV Format Guide](https://en.wikipedia.org/wiki/Comma-separated_values)
- [Responsive Web Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)

---

**Built with ❤️ for TJ Clays Limited manufacturing operations**