# TJ Clays Production Dashboard - Data Extraction Guide

A comprehensive technical guide for understanding how data is extracted from the CSV file and displayed on the dashboard.

## 📋 Table of Contents

- [CSV File Structure](#csv-file-structure)
- [Data Extraction Process](#data-extraction-process)
- [Production Metrics](#production-metrics)
- [Performance Indicators](#performance-indicators)
- [Rework Analysis](#rework-analysis)
- [Calculated Fields](#calculated-fields)
- [Date Handling](#date-handling)
- [Error Handling](#error-handling)
- [Data Validation](#data-validation)
- [Troubleshooting](#troubleshooting)

## 📁 CSV File Structure

### File Layout Overview
```
dailyproduction.csv (32 lines total)
├── Header Information (Lines 1-5)
├── Production Data (Lines 6-15)
├── On Time Performance (Lines 16-21)
├── In Full Performance (Lines 22-27)
└── Rework Data (Lines 28-32)
```

### Line-by-Line Breakdown

| Line | Content | Purpose |
|------|---------|---------|
| 1 | `TJ Clays Limited t/a TJ Books` | Company header |
| 2 | `Daily production report` | Report type |
| 3 | `June` | Month identifier |
| 4 | `45820,Thursday` | Excel date serial + day name |
| 5 | `,,12,45809,,154,165` | Additional metrics |
| 6 | *(empty)* | Separator |
| 7 | `Yesterday,,,,,,,,,,,,,Month to date` | Section headers |
| 8 | *(empty)* | Separator |
| 9 | `Quantity,,,,,,,,,,,,,Quantity` | Column headers |
| 10 | Column definitions | Field names |
| 11-14 | Production data | Product line metrics |
| 15 | *(empty)* | Separator |
| 16-21 | On time performance | Delivery metrics |
| 22-27 | In full performance | Completion metrics |
| 28-32 | Rework data | Quality metrics |

## 🔍 Data Extraction Process

### JavaScript Parsing Function
```javascript
function parseCSVData(csvText) {
    const lines = csvText.split('\n').map(line => line.trim()).filter(line => line);
    const data = {};
    
    // Extract data from specific lines and columns
    // See detailed extraction below
    
    return data;
}
```

### Data Flow
1. **CSV Read** → `window.fs.readFile('dailyproduction.csv')`
2. **Line Split** → Split by newline characters
3. **Column Parse** → Split each line by commas
4. **Type Conversion** → Convert strings to numbers/dates
5. **Data Structure** → Organize into dashboard object
6. **Render** → Display on dashboard

## 📊 Production Metrics

### Line 11: Conventional Books
```csv
Conventional books,1614,11000,-9386,,,11,132,,12.22727273,83.33333333,,,Conventional books,11184,115500,-104316,,
```

**Extraction Mapping:**
```javascript
const conventionalLine = lines[10].split(','); // Line 11 (0-indexed)
data.conventional = {
    yesterday: { 
        actual: parseInt(conventionalLine[1]),     // 1614
        target: parseInt(conventionalLine[2]),     // 11000
        variance: parseInt(conventionalLine[3]),   // -9386
        heads: parseInt(conventionalLine[6]),      // 11
        hours: parseInt(conventionalLine[7])       // 132
    },
    mtd: { 
        actual: parseInt(conventionalLine[14]),    // 11184
        target: parseInt(conventionalLine[15]),    // 115500
        variance: parseInt(conventionalLine[16])   // -104316
    }
};
```

### Line 12: Print on Demand (POD)
```csv
POD,800,1250,-450,,,2,24,,33.33333333,52.08333333,,,POD,7927,11250,-3323,,
```

**Extraction Mapping:**
```javascript
const podLine = lines[11].split(',');
data.pod = {
    yesterday: { 
        actual: parseInt(podLine[1]),     // 800
        target: parseInt(podLine[2]),     // 1250
        variance: parseInt(podLine[3]),   // -450
        heads: parseInt(podLine[6]),      // 2
        hours: parseInt(podLine[7])       // 24
    },
    mtd: { 
        actual: parseInt(podLine[14]),    // 7927
        target: parseInt(podLine[15]),    // 11250
        variance: parseInt(podLine[16])   // -3323
    }
};
```

### Line 13: Personalised Books
```csv
Personalised books,1774,3000,-1226,,,2,24,,73.91666667,125,,,Personalised books,11756,26000.001,-14244.001,,
```

**Extraction Mapping:**
```javascript
const personalizedLine = lines[12].split(',');
data.personalized = {
    yesterday: { 
        actual: parseInt(personalizedLine[1]),     // 1774
        target: parseInt(personalizedLine[2]),     // 3000
        variance: parseInt(personalizedLine[3]),   // -1226
        heads: parseInt(personalizedLine[6]),      // 2
        hours: parseInt(personalizedLine[7])       // 24
    },
    mtd: { 
        actual: parseInt(personalizedLine[14]),    // 11756
        target: parseFloat(personalizedLine[15]),  // 26000.001
        variance: parseFloat(personalizedLine[16]) // -14244.001
    }
};
```

### Line 14: Clays Trade
```csv
Clays Trade,269,12500,-12231,,,10,120,,2.241666667,104.1666667,,,Clays Trade,8541,131250,-122709,,
```

**Extraction Mapping:**
```javascript
const tradeLine = lines[13].split(',');
data.trade = {
    yesterday: { 
        actual: parseInt(tradeLine[1]),     // 269
        target: parseInt(tradeLine[2]),     // 12500
        variance: parseInt(tradeLine[3]),   // -12231
        heads: parseInt(tradeLine[6]),      // 10
        hours: parseInt(tradeLine[7])       // 120
    },
    mtd: { 
        actual: parseInt(tradeLine[14]),    // 8541
        target: parseInt(tradeLine[15]),    // 131250
        variance: parseInt(tradeLine[16])   // -122709
    }
};
```

## 📈 Performance Indicators

### On Time Performance Data

**Line 18: Conventional Books & Clays Trade**
```csv
Conventional books & Clays Trade,3,23,506,4171,,,,,,,0.869565217,,Conventional books & Clays Trade,15,484,7541,99126,0.969008264
```

**Line 19: POD**
```csv
POD,,,,,,,,,,,1,,POD,,,,,1
```

**Line 20: Personalised Books**
```csv
Personalised books,,,498,1774,,,,,,,0.719278467,,Personalised books,,,3619,11756,0.692157196
```

**Extraction Code:**
```javascript
const onTimeConvLine = lines[17].split(',');
data.onTime = {
    conventional: {
        yesterday: parseFloat(onTimeConvLine[11]) * 100,  // 0.869565217 * 100 = 87.0%
        mtd: parseFloat(onTimeConvLine[18]) * 100         // 0.969008264 * 100 = 96.9%
    },
    pod: {
        yesterday: parseFloat(lines[18].split(',')[11]) * 100,  // 1 * 100 = 100%
        mtd: parseFloat(lines[18].split(',')[18]) * 100         // 1 * 100 = 100%
    },
    personalized: {
        yesterday: parseFloat(lines[19].split(',')[11]) * 100,  // 0.719278467 * 100 = 71.9%
        mtd: parseFloat(lines[19].split(',')[18]) * 100         // 0.692157196 * 100 = 69.2%
    }
};
```

## 🔧 Rework Analysis

### Rework Data Structure

**Line 30: Yesterday Rework**
```csv
Yesterday,1,1,750,354.25
```

**Line 32: Month to Date Rework**
```csv
Month to date,8,10,3483,3163.22
```

**Extraction Code:**
```javascript
const reworkYesterdayLine = lines[29].split(','); // Line 30 (0-indexed)
const reworkMtdLine = lines[31].split(',');       // Line 32 (0-indexed)

data.rework = {
    yesterday: {
        jobs: parseInt(reworkYesterdayLine[1]),        // 1
        jobParts: parseInt(reworkYesterdayLine[2]),    // 1
        quantity: parseInt(reworkYesterdayLine[3]),    // 750
        value: parseFloat(reworkYesterdayLine[4])      // 354.25
    },
    mtd: {
        jobs: parseInt(reworkMtdLine[1]),              // 8
        jobParts: parseInt(reworkMtdLine[2]),          // 10
        quantity: parseInt(reworkMtdLine[3]),          // 3483
        value: parseFloat(reworkMtdLine[4])            // 3163.22
    }
};
```

## 🧮 Calculated Fields

### Total Hours Calculation
```javascript
const totalHours = (data.conventional.yesterday.hours || 0) +  // 132
                  (data.pod.yesterday.hours || 0) +            // 24
                  (data.personalized.yesterday.hours || 0) +   // 24
                  (data.trade.yesterday.hours || 0);           // 120
// Result: 300 hours
```

### Total Heads Calculation
```javascript
const totalHeads = (data.conventional.yesterday.heads || 0) +  // 11
                  (data.pod.yesterday.heads || 0) +            // 2
                  (data.personalized.yesterday.heads || 0) +   // 2
                  (data.trade.yesterday.heads || 0);           // 10
// Result: 25 heads
```

### Total Production Calculation
```javascript
// Yesterday Total
const totalYesterday = data.conventional.yesterday.actual +  // 1614
                      data.pod.yesterday.actual +           // 800
                      data.personalized.yesterday.actual +  // 1774
                      data.trade.yesterday.actual;          // 269
// Result: 4,457 units

// Month to Date Total
const totalMTD = data.conventional.mtd.actual +  // 11184
                 data.pod.mtd.actual +           // 7927
                 data.personalized.mtd.actual +  // 11756
                 data.trade.mtd.actual;          // 8541
// Result: 39,408 units
```

### Progress Percentage Calculation
```javascript
function calculatePercentage(actual, target) {
    if (!target || target === 0) return 0;
    return Math.round((actual / target) * 100 * 10) / 10;
}

// Example: Conventional Books Yesterday
// calculatePercentage(1614, 11000) = 14.7%
```

## 📅 Date Handling

### Excel Serial Date Conversion

**Input:** `45820` (Excel serial number from Line 4)

**Conversion Process:**
```javascript
function excelDateToJSDate(serial) {
    const excelEpoch = new Date(1899, 11, 30); // December 30, 1899
    const msPerDay = 24 * 60 * 60 * 1000;
    return new Date(excelEpoch.getTime() + (serial * msPerDay));
}

const jsDate = excelDateToJSDate(45820);
// Result: 2025-06-12T00:00:00.000Z
```

**Formatting:**
```javascript
function formatDate(jsDate) {
    const weekday = jsDate.toLocaleDateString('en-GB', { weekday: 'long' });
    const day = jsDate.getDate();
    const month = jsDate.toLocaleDateString('en-GB', { month: 'long' });
    const year = jsDate.getFullYear();
    return `${weekday} ${day}${getOrdinalSuffix(day)} ${month} ${year}`;
}

// Result: "Thursday 12th June 2025"
```

## ⚠️ Error Handling

### Fallback Values
```javascript
// If CSV data is missing or invalid, use fallback values
data.conventional = {
    yesterday: { 
        actual: parseInt(conventionalLine[1]) || 1614,     // Fallback to 1614
        target: parseInt(conventionalLine[2]) || 11000,    // Fallback to 11000
        variance: parseInt(conventionalLine[3]) || -9386   // Fallback to -9386
    }
};
```

### Data Type Validation
```javascript
// Ensure numeric fields are properly converted
const actual = parseInt(line[1]);
if (isNaN(actual)) {
    console.warn('Invalid numeric value found, using fallback');
    actual = fallbackValue;
}
```

### Missing Line Handling
```javascript
// Check if line exists before processing
if (lines[10] && lines[10].length > 16) {
    // Process conventional books data
} else {
    console.error('Conventional books data line missing or incomplete');
    // Use fallback data
}
```

## ✅ Data Validation

### CSV Structure Validation
```javascript
function validateCSVStructure(lines) {
    const validations = [
        { check: lines.length >= 32, message: 'CSV must have at least 32 lines' },
        { check: lines[0].includes('TJ Clays'), message: 'Missing company header' },
        { check: lines[3].includes(','), message: 'Date line malformed' },
        { check: lines[10].split(',').length > 16, message: 'Production data incomplete' }
    ];
    
    validations.forEach(validation => {
        if (!validation.check) {
            console.error('CSV Validation Failed:', validation.message);
        }
    });
}
```

### Data Range Validation
```javascript
function validateProductionData(data) {
    Object.entries(data).forEach(([product, metrics]) => {
        if (metrics.yesterday.actual < 0) {
            console.warn(`Negative production value for ${product}`);
        }
        if (metrics.yesterday.target <= 0) {
            console.warn(`Invalid target value for ${product}`);
        }
    });
}
```

## 🐛 Troubleshooting

### Common Data Extraction Issues

**Issue: Date showing as number**
```
Problem: Dashboard shows "45820" instead of date
Solution: Check Excel date conversion function
```

**Issue: Missing production data**
```
Problem: Production cards show zeros or fallback values
Solution: Verify CSV lines 11-14 have complete data
Check: lines[10].split(',')[1] should return production actual
```

**Issue: Incorrect totals**
```
Problem: Total hours/units don't match expected values
Solution: Check individual product line data extraction
Verify: Each product line has valid numeric values
```

**Issue: Rework data not displaying**
```
Problem: Rework section shows fallback values
Solution: Check lines 30 and 32 exist and have 5 columns
Verify: lines[29][1] and lines[31][1] contain job counts
```

### Debug Console Commands
```javascript
// Check CSV structure
console.log('Total lines:', lines.length);
console.log('Date line:', lines[3]);
console.log('Conventional data:', lines[10]);
console.log('Rework yesterday:', lines[29]);

// Validate data extraction
console.log('Parsed data:', data);
console.log('Total hours calculation:', 
    data.conventional.yesterday.hours + 
    data.pod.yesterday.hours + 
    data.personalized.yesterday.hours + 
    data.trade.yesterday.hours
);
```

### CSV Format Checker
```bash
# Command line tools to validate CSV
head -15 dailyproduction.csv | nl  # Show first 15 lines with numbers
tail -5 dailyproduction.csv | nl   # Show last 5 lines with numbers
wc -l dailyproduction.csv          # Count total lines (should be 32)
```

## 📊 Data Mapping Summary

| Dashboard Element | CSV Source | Processing |
|------------------|------------|------------|
| Report Date | Line 4, Col 1 | Excel serial → formatted date |
| Production Actuals | Lines 11-14, Col 2 | parseInt() |
| Production Targets | Lines 11-14, Col 3 | parseInt() |
| Production Variance | Lines 11-14, Col 4 | parseInt() |
| Resource Hours | Lines 11-14, Col 8 | parseInt() |
| Resource Heads | Lines 11-14, Col 7 | parseInt() |
| On Time % | Lines 18-20, Cols 12&19 | parseFloat() × 100 |
| Rework Jobs | Lines 30&32, Col 2 | parseInt() |
| Rework Quantities | Lines 30&32, Col 4 | parseInt() |
| Rework Values | Lines 30&32, Col 5 | parseFloat() |
| Total Hours | Calculated | Sum of all product hours |
| Total Units | Calculated | Sum of all production actuals |
| Progress Bars | Calculated | (Actual ÷ Target) × 100 |

---

*This guide provides complete technical documentation for data extraction from the TJ Clays production CSV file. For dashboard setup and display optimization, see the main README.md file.*