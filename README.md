# TJ Books - TV Production Dashboard

A modern, real-time production dashboard optimized for 16:9 TV displays, providing comprehensive visibility into TJ Books daily manufacturing operations and key performance indicators.

![Dashboard Preview](https://img.shields.io/badge/Status-Live-brightgreen) ![License](https://img.shields.io/badge/License-MIT-blue) ![Version](https://img.shields.io/badge/Version-2.0-orange) ![Display](https://img.shields.io/badge/Optimized-TV_Display-purple)

## 🖥️ TV Display Features

- **16:9 Aspect Ratio Optimized** - Perfect for modern TV screens and digital displays
- **4x4 Production Grid** - Maximum visibility of all product lines at once
- **Large Typography** - Readable from distance with auto-scaling fonts
- **High Contrast Design** - Professional grey gradient for excellent visibility
- **No Scrolling Required** - All critical data fits on one screen
- **Auto-refresh** - Updates every 5 minutes automatically

## 📊 Dashboard Sections

### Production Metrics (4x4 Grid)
- **Conventional Books** - Daily and monthly production tracking with targets
- **Print on Demand (POD)** - Volume, performance, and efficiency metrics  
- **Personalised Books** - Custom production monitoring and variance analysis
- **Clays Trade** - Trade operations tracking with resource allocation

### Key Performance Indicators
- **On Time Performance** - Delivery punctuality percentages by product line
- **Rework Analysis** - Quality tracking with job counts, quantities, and financial impact
- **Summary Statistics** - Real-time totals for units and operational hours

### Real-time Data Points
- Production quantities (Actual vs Target)
- Variance tracking with color-coded indicators
- Resource allocation (Heads, Hours per product line)
- On-time delivery percentages
- Rework costs and quantities
- Progress bars showing target achievement

## 🚀 Quick Setup for TV Display

### Prerequisites
- TV or large monitor with web browser capability
- GitHub account for hosting
- Daily production data in CSV format

### 1. Repository Setup
```bash
git clone https://github.com/yourusername/tj-clays-dashboard.git
cd tj-clays-dashboard
# Add your CSV file
cp your-daily-report.csv dailyproduction.csv
git add .
git commit -m "Setup TV dashboard"
git push
```

### 2. Enable GitHub Pages
1. Go to repository **Settings** → **Pages**
2. Select **"Deploy from a branch"**
3. Choose **"main"** branch and **"/ (root)"** folder
4. Your dashboard will be live at: `https://yourusername.github.io/tj-clays-dashboard`

### 3. Configure TV Display
1. Open dashboard URL in TV browser
2. Set browser to fullscreen mode
3. Bookmark for easy access
4. Configure auto-refresh if supported

## 📁 File Structure
```
tj-clays-dashboard/
├── index.html              # Main dashboard (TV optimized)
├── dailyproduction.csv     # Daily production data
├── README.md              # This documentation
└── .gitignore             # Git ignore file
```

## 📊 CSV Data Format

### Required Structure
Your `dailyproduction.csv` must follow this exact format:

```csv
TJ Clays Limited t/a TJ Books
Daily production report
June
45820,Thursday
,,12,45809,,154,165
...
[Production data rows]
...
Rework
,Number of jobs,Number of job parts,Quantity,Value (£)
Yesterday,1,1,750,354.25
...
Month to date,8,10,3483,3163.22
```

### Key Data Points Extracted
| Data Type | CSV Location | Dashboard Display |
|-----------|-------------|-------------------|
| Date | Line 4, Column 1 | Excel serial → "Thursday 12th June 2025" |
| Production Actual | Lines 11-14, Column 2 | Individual product cards |
| Production Target | Lines 11-14, Column 3 | Target vs actual comparison |
| Production Variance | Lines 11-14, Column 4 | Color-coded variance indicators |
| Hours per Product | Lines 11-14, Column 8 | Resource allocation tracking |
| Heads per Product | Lines 11-14, Column 7 | Staffing levels |
| On Time % | Lines 18-20, Columns 12&19 | Performance indicators |
| Rework Yesterday | Line 30, Columns 2-5 | Quality tracking |
| Rework MTD | Line 32, Columns 2-5 | Monthly quality trends |

### Calculated Metrics
- **Total Hours**: Sum of all product line hours (Conventional: 132 + POD: 24 + Personalised: 24 + Trade: 120 = 300)
- **Total Units**: Sum of all production actuals
- **Progress Bars**: (Actual ÷ Target) × 100
- **Performance Colors**: Green ≥90%, Amber 70-89%, Red <70%

## 🔄 Daily Update Process

### Manual Method (Recommended)
1. **Export** your daily Excel report to CSV format
2. **Replace** existing `dailyproduction.csv` in repository
3. **Commit** changes via GitHub web interface or Git
4. **Dashboard updates** automatically within 5 minutes

### Automated Process
For advanced users, set up GitHub Actions:

```yaml
# .github/workflows/update-dashboard.yml
name: Update Production Dashboard
on:
  schedule:
    - cron: '0 8 * * 1-5'  # 8 AM weekdays
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Download latest production data
        run: |
          # Add your data source automation here
          # Examples: FTP download, API call, email attachment processing
      - name: Commit updated data
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add dailyproduction.csv
          git commit -m "Auto-update production data" || exit 0
          git push
```

## 🎨 TV Display Customization

### Typography Scaling
```css
/* Default TV sizes */
.company-name { font-size: 2.8rem; }
.metric-header { font-size: 1.1rem; }

/* Large TV displays (1920px+) */
@media (min-width: 1920px) {
    .company-name { font-size: 3.2rem; }
    .metric-header { font-size: 1.3rem; }
}
```

### Color Scheme
```css
/* Product line colors */
.conventional { border-left-color: #e74c3c; } /* Red */
.pod { border-left-color: #f39c12; }         /* Orange */
.personalized { border-left-color: #9b59b6; } /* Purple */
.trade { border-left-color: #1abc9c; }       /* Teal */

/* Background gradient */
background: linear-gradient(135deg, #718096 0%, #4A5568 100%);
```

### Layout Adjustments
- **4x4 Grid**: Default for TV displays (1200px+)
- **2x2 Grid**: Tablet displays (768px-1199px)
- **Single Column**: Mobile displays (<768px)

## 🔧 Troubleshooting

### Common TV Display Issues

**Dashboard not loading:**
- Check internet connection on TV/display device
- Verify GitHub Pages is enabled and deployed
- Try accessing URL directly: `https://yourusername.github.io/repository-name`

**Data not updating:**
- Confirm `dailyproduction.csv` is in repository root
- Check file was committed and pushed to GitHub
- Verify CSV format matches expected structure
- Clear browser cache and refresh

**Text too small/large:**
- Adjust browser zoom level (typically 100%-150% for TVs)
- Modify CSS media queries for specific screen sizes
- Check TV resolution settings

**Layout issues:**
- Ensure TV is in landscape orientation
- Set browser to fullscreen mode (F11)
- Check TV aspect ratio settings (should be 16:9)

### CSV Format Validation
```bash
# Check your CSV structure
head -5 dailyproduction.csv
# Should show:
# TJ Clays Limited t/a TJ Books
# Daily production report  
# June
# 45820,Thursday
# ,,12,45809,,154,165
```

## 📈 Performance Metrics

- **Load Time**: < 3 seconds on standard broadband
- **Data Processing**: Client-side JavaScript (no server required)
- **Auto-refresh**: Every 5 minutes
- **Browser Compatibility**: Chrome, Firefox, Safari, Edge
- **TV Compatibility**: Smart TVs with modern browsers

## 🔒 Security Considerations

- **Public Data**: Dashboard displays publicly accessible data
- **No Authentication**: Designed for internal display purposes
- **HTTPS**: Served securely via GitHub Pages
- **No Data Storage**: All processing done client-side

## 📱 Multi-Device Support

While optimized for TV displays, the dashboard also works on:
- **Desktop Computers**: Full feature set
- **Tablets**: Responsive 2x2 grid layout
- **Mobile Phones**: Single column layout
- **Laptops**: Adaptive scaling

## 🚀 Advanced Features

### Custom Metrics
To add new production lines:
1. Update CSV with additional rows
2. Modify parsing function in `index.html`
3. Add new metric cards to grid
4. Update color scheme for new categories

### Integration Options
- **Digital Signage**: Works with most digital signage solutions
- **Kiosk Mode**: Set browser to kiosk/fullscreen mode
- **Multiple Displays**: Deploy multiple dashboards for different departments
- **Mobile Apps**: Wrap in WebView for mobile applications

## 📞 Support & Maintenance

### Regular Maintenance
- **Weekly**: Verify data updates correctly
- **Monthly**: Check dashboard performance and load times
- **Quarterly**: Review color coding and thresholds
- **Annually**: Update dependencies and browser compatibility

### Getting Help
- **Issues**: Create GitHub issue with screenshot and description
- **Feature Requests**: Submit via GitHub discussions
- **CSV Format**: Reference this documentation and provided examples
- **TV Setup**: Consult TV manual for browser/display settings

## 🔗 Technical Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [CSV Format Standards](https://tools.ietf.org/html/rfc4180)
- [Responsive Web Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [TV Browser Compatibility](https://caniuse.com/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏷️ Version History

- **v2.0** - TV optimization, rework data, calculated hours
- **v1.0** - Initial dashboard with basic production metrics

---
  
*Optimized for TV displays and real-time production monitoring*