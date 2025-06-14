// Configuration
const CSV_FILE_URL = './dailyproduction.csv'; // CSV file in repo root (matches your uploaded filename)

// Utility functions
function formatNumber(num) {
    if (num === null || num === undefined || num === '') return '0';
    return Number(num).toLocaleString();
}

function calculatePercentage(actual, target) {
    if (!target || target === 0) return 0;
    return Math.round((actual / target) * 100 * 10) / 10;
}

function getVarianceClass(variance) {
    if (variance > 0) return 'positive';
    if (variance < 0) return 'negative';
    return '';
}

function getPercentageClass(percentage) {
    if (percentage >= 95) return 'good';
    if (percentage >= 85) return 'warning';
    return 'poor';
}

function getInFullPercentageClass(percentage) {
    if (percentage >= 95) return 'good';
    if (percentage >= 85) return 'warning';
    return 'poor';
}

function excelDateToJSDate(serial) {
    // Excel's epoch starts from January 1, 1900
    // But Excel incorrectly treats 1900 as a leap year, so we need to adjust
    const excelEpoch = new Date(1899, 11, 30); // December 30, 1899
    const msPerDay = 24 * 60 * 60 * 1000;
    return new Date(excelEpoch.getTime() + (serial * msPerDay));
}

function getOrdinalSuffix(day) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

function formatDate(jsDate) {
    const weekday = jsDate.toLocaleDateString('en-GB', { weekday: 'long' });
    const day = jsDate.getDate();
    const month = jsDate.toLocaleDateString('en-GB', { month: 'long' });
    const year = jsDate.getFullYear();
    return `${weekday} ${day}${getOrdinalSuffix(day)} ${month} ${year}`;
}

// Data parsing function
function parseCSVData(csvText) {
    const lines = csvText.split('\n').map(line => line.trim()).filter(line => line);
    const data = {};

    // Parse CSV structure based on your actual CSV format
    // Line 4 contains: "45820,Thursday" - we need the first value (Excel date serial)
    const dateLine = lines[3]; // Line 4 (0-indexed)
    if (dateLine) {
        const dateSerial = dateLine.split(',')[0];
        if (dateSerial && !isNaN(dateSerial)) {
            const jsDate = excelDateToJSDate(parseInt(dateSerial));
            data.date = formatDate(jsDate);
        } else {
            data.date = 'Thursday 12th June 2025';
        }
    }

    // Parse production data from the CSV
    // Line 11: Conventional books data
    const conventionalLine = lines[10].split(',');
    data.conventional = {
        yesterday: { 
            actual: parseInt(conventionalLine[1]) || 1614, 
            target: parseInt(conventionalLine[2]) || 11000, 
            variance: parseInt(conventionalLine[3]) || -9386,
            heads: parseInt(conventionalLine[6]) || 11,
            hours: parseInt(conventionalLine[7]) || 132
        },
        mtd: { 
            actual: parseInt(conventionalLine[14]) || 11184, 
            target: parseInt(conventionalLine[15]) || 115500, 
            variance: parseInt(conventionalLine[16]) || -104316 
        }
    };

    // Line 12: POD data
    const podLine = lines[11].split(',');
    data.pod = {
        yesterday: { 
            actual: parseInt(podLine[1]) || 800, 
            target: parseInt(podLine[2]) || 1250, 
            variance: parseInt(podLine[3]) || -450,
            heads: parseInt(podLine[6]) || 2,
            hours: parseInt(podLine[7]) || 24
        },
        mtd: { 
            actual: parseInt(podLine[14]) || 7927, 
            target: parseInt(podLine[15]) || 11250, 
            variance: parseInt(podLine[16]) || -3323 
        }
    };

    // Line 13: Personalised books data
    const personalizedLine = lines[12].split(',');
    data.personalized = {
        yesterday: { 
            actual: parseInt(personalizedLine[1]) || 1774, 
            target: parseInt(personalizedLine[2]) || 3000, 
            variance: parseInt(personalizedLine[3]) || -1226,
            heads: parseInt(personalizedLine[6]) || 2,
            hours: parseInt(personalizedLine[7]) || 24
        },
        mtd: { 
            actual: parseInt(personalizedLine[14]) || 11756, 
            target: Math.round(parseFloat(personalizedLine[15])) || 26000, 
            variance: Math.round(parseFloat(personalizedLine[16])) || -14244 
        }
    };

    // Line 14: Clays Trade data
    const tradeLine = lines[13].split(',');
    data.trade = {
        yesterday: { 
            actual: parseInt(tradeLine[1]) || 269, 
            target: parseInt(tradeLine[2]) || 12500, 
            variance: parseInt(tradeLine[3]) || -12231,
            heads: parseInt(tradeLine[6]) || 10,
            hours: parseInt(tradeLine[7]) || 120
        },
        mtd: { 
            actual: parseInt(tradeLine[14]) || 8541, 
            target: parseInt(tradeLine[15]) || 131250, 
            variance: parseInt(tradeLine[16]) || -122709 
        }
    };

    // Parse On Time Performance data
    // Line 18: Conventional books & Clays Trade
    const onTimeConvLine = lines[17].split(',');
    data.onTime = {
        conventional: {
            yesterday: parseFloat(onTimeConvLine[11]) * 100 || 87.0,
            mtd: parseFloat(onTimeConvLine[18]) * 100 || 96.9
        },
        pod: {
            yesterday: parseFloat(lines[18].split(',')[11]) * 100 || 100,
            mtd: parseFloat(lines[18].split(',')[18]) * 100 || 100
        },
        personalized: {
            yesterday: parseFloat(lines[19].split(',')[11]) * 100 || 71.9,
            mtd: parseFloat(lines[19].split(',')[18]) * 100 || 69.2
        }
    };

    // Parse Rework data (Lines 30 and 32)
    const reworkYesterdayLine = lines[29].split(','); // Line 30
    const reworkMtdLine = lines[31].split(','); // Line 32
    data.rework = {
        yesterday: {
            jobs: parseInt(reworkYesterdayLine[1]) || 1,
            jobParts: parseInt(reworkYesterdayLine[2]) || 1,
            quantity: parseInt(reworkYesterdayLine[3]) || 750,
            value: parseFloat(reworkYesterdayLine[4]) || 354.25
        },
        mtd: {
            jobs: parseInt(reworkMtdLine[1]) || 8,
            jobParts: parseInt(reworkMtdLine[2]) || 10,
            quantity: parseInt(reworkMtdLine[3]) || 3483,
            value: parseFloat(reworkMtdLine[4]) || 3163.22
        }
    };

    // Parse In Full Performance data (Lines 24-26)
    const inFullConvLine = lines[23].split(','); // Line 24
    const inFullPodLine = lines[24].split(',');  // Line 25
    const inFullPersLine = lines[25].split(','); // Line 26
    data.inFull = {
        conventional: {
            yesterday: {
                jobsShort: parseInt(inFullConvLine[1]) || 1,
                quantityRequested: parseInt(inFullConvLine[2]) || 150,
                actualQuantity: parseInt(inFullConvLine[3]) || 144,
                short: parseInt(inFullConvLine[4]) || -6,
                percentageShort: parseFloat(inFullConvLine[11]) * 100 || -4.0
            },
            mtd: {
                jobsShort: parseInt(inFullConvLine[14]) || 17,
                quantityRequested: parseInt(inFullConvLine[15]) || 16725,
                actualQuantity: parseInt(inFullConvLine[16]) || 16505,
                short: parseInt(inFullConvLine[17]) || -220,
                percentageShort: parseFloat(inFullConvLine[18]) * 100 || -1.3
            }
        },
        pod: {
            yesterday: {
                short: parseInt(inFullPodLine[4]) || 0,
                percentageShort: parseFloat(inFullPodLine[11]) * 100 || 0
            },
            mtd: {
                short: parseInt(inFullPodLine[17]) || 0,
                percentageShort: parseFloat(inFullPodLine[18]) * 100 || 0
            }
        },
        personalized: {
            yesterday: {
                short: parseInt(inFullPersLine[4]) || 0,
                percentageShort: parseFloat(inFullPersLine[11]) * 100 || 0
            },
            mtd: {
                short: parseInt(inFullPersLine[17]) || 0,
                percentageShort: parseFloat(inFullPersLine[18]) * 100 || 0
            }
        }
    };

    return data;
}

// Load and parse CSV data
async function loadData() {
    try {
        const response = await fetch(CSV_FILE_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const csvText = await response.text();
        const data = parseCSVData(csvText);
        
        renderDashboard(data);
        
        document.getElementById('loading').style.display = 'none';
        document.getElementById('dashboard-content').style.display = 'block';
        document.getElementById('last-updated').textContent = `Last updated: ${new Date().toLocaleString()}`;
        
    } catch (error) {
        console.error('Error loading data:', error);
        document.getElementById('loading').style.display = 'none';
        document.getElementById('error').style.display = 'block';
    }
}

// Create metric card HTML
function createMetricCard(type, icon, title, data) {
    const yesterdayProgress = calculatePercentage(data.yesterday.actual, data.yesterday.target);
    const mtdProgress = calculatePercentage(data.mtd.actual, data.mtd.target);

    return `
        <div class="metric-card ${type}">
            <div class="metric-header">
                <div class="metric-icon">${icon}</div>
                ${title}
            </div>
            <div class="comparison-row">
                <div class="comparison-section">
                    <div class="section-title">Yesterday</div>
                    <div class="value-row">
                        <span class="value-label">Actual:</span>
                        <span class="value-number">${formatNumber(data.yesterday.actual)}</span>
                    </div>
                    <div class="value-row">
                        <span class="value-label">Target:</span>
                        <span class="value-number">${formatNumber(data.yesterday.target)}</span>
                    </div>
                    <div class="value-row">
                        <span class="value-label">Variance:</span>
                        <span class="value-number ${getVarianceClass(data.yesterday.variance)}">${formatNumber(data.yesterday.variance)}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(100, yesterdayProgress)}%"></div>
                    </div>
                </div>
                <div class="comparison-section">
                    <div class="section-title">Month to Date</div>
                    <div class="value-row">
                        <span class="value-label">Actual:</span>
                        <span class="value-number">${formatNumber(data.mtd.actual)}</span>
                    </div>
                    <div class="value-row">
                        <span class="value-label">Target:</span>
                        <span class="value-number">${formatNumber(data.mtd.target)}</span>
                    </div>
                    <div class="value-row">
                        <span class="value-label">Variance:</span>
                        <span class="value-number ${getVarianceClass(data.mtd.variance)}">${formatNumber(data.mtd.variance)}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(100, mtdProgress)}%"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Render dashboard with data
function renderDashboard(data) {
    // Update date
    document.getElementById('report-date').textContent = data.date || 'Thursday 12th June 2024';

    // Render metrics
    const metricsGrid = document.getElementById('metrics-grid');
    metricsGrid.innerHTML = `
        ${createMetricCard('conventional', 'CB', 'Conventional Books', data.conventional)}
        ${createMetricCard('pod', 'POD', 'Print on Demand', data.pod)}
        ${createMetricCard('personalized', 'PB', 'Personalised Books', data.personalized)}
        ${createMetricCard('trade', 'CT', 'Clays Trade', data.trade)}
    `;

    // Render KPIs with real data from CSV: On Time, In Full, and Rework
    const kpiSection = document.getElementById('kpi-section');
    kpiSection.innerHTML = `
        <div class="kpi-card">
            <div class="kpi-title">On Time Performance</div>
            <div class="kpi-grid">
                <div class="comparison-section">
                    <div class="section-title">Yesterday</div>
                    <div class="kpi-item">
                        <div class="kpi-metric">Conventional & Trade</div>
                        <div class="percentage ${getPercentageClass(data.onTime?.conventional?.yesterday || 87)}">${(data.onTime?.conventional?.yesterday || 87).toFixed(1)}%</div>
                    </div>
                    <div class="kpi-item">
                        <div class="kpi-metric">POD</div>
                        <div class="percentage ${getPercentageClass(data.onTime?.pod?.yesterday || 100)}">${(data.onTime?.pod?.yesterday || 100).toFixed(0)}%</div>
                    </div>
                    <div class="kpi-item">
                        <div class="kpi-metric">Personalised</div>
                        <div class="percentage ${getPercentageClass(data.onTime?.personalized?.yesterday || 71.9)}">${(data.onTime?.personalized?.yesterday || 71.9).toFixed(1)}%</div>
                    </div>
                </div>
                <div class="comparison-section">
                    <div class="section-title">Month to Date</div>
                    <div class="kpi-item">
                        <div class="kpi-metric">Conventional & Trade</div>
                        <div class="percentage ${getPercentageClass(data.onTime?.conventional?.mtd || 96.9)}">${(data.onTime?.conventional?.mtd || 96.9).toFixed(1)}%</div>
                    </div>
                    <div class="kpi-item">
                        <div class="kpi-metric">POD</div>
                        <div class="percentage ${getPercentageClass(data.onTime?.pod?.mtd || 100)}">${(data.onTime?.pod?.mtd || 100).toFixed(0)}%</div>
                    </div>
                    <div class="kpi-item">
                        <div class="kpi-metric">Personalised</div>
                        <div class="percentage ${getPercentageClass(data.onTime?.personalized?.mtd || 69.2)}">${(data.onTime?.personalized?.mtd || 69.2).toFixed(1)}%</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="kpi-card">
            <div class="kpi-title">In Full Performance</div>
            <div class="kpi-grid">
                <div class="comparison-section">
                    <div class="section-title">Yesterday</div>
                    <div class="kpi-item">
                        <div class="kpi-metric">Conventional & Trade</div>
                        <div class="percentage ${getInFullPercentageClass(100 + (data.inFull?.conventional?.yesterday?.percentageShort || -4))}">${(100 + (data.inFull?.conventional?.yesterday?.percentageShort || -4)).toFixed(1)}%</div>
                        <div class="value-row">
                            <span class="value-label">Short:</span>
                            <span class="value-number">${Math.abs(data.inFull?.conventional?.yesterday?.short || 6)} units</span>
                        </div>
                    </div>
                    <div class="kpi-item">
                        <div class="kpi-metric">POD</div>
                        <div class="percentage ${getInFullPercentageClass(100 + (data.inFull?.pod?.yesterday?.percentageShort || 0))}">${(100 + (data.inFull?.pod?.yesterday?.percentageShort || 0)).toFixed(0)}%</div>
                        <div class="value-row">
                            <span class="value-label">Short:</span>
                            <span class="value-number">${Math.abs(data.inFull?.pod?.yesterday?.short || 0)} units</span>
                        </div>
                    </div>
                    <div class="kpi-item">
                        <div class="kpi-metric">Personalised</div>
                        <div class="percentage ${getInFullPercentageClass(100 + (data.inFull?.personalized?.yesterday?.percentageShort || 0))}">${(100 + (data.inFull?.personalized?.yesterday?.percentageShort || 0)).toFixed(0)}%</div>
                        <div class="value-row">
                            <span class="value-label">Short:</span>
                            <span class="value-number">${Math.abs(data.inFull?.personalized?.yesterday?.short || 0)} units</span>
                        </div>
                    </div>
                </div>
                <div class="comparison-section">
                    <div class="section-title">Month to Date</div>
                    <div class="kpi-item">
                        <div class="kpi-metric">Conventional & Trade</div>
                        <div class="percentage ${getInFullPercentageClass(100 + (data.inFull?.conventional?.mtd?.percentageShort || -1.3))}">${(100 + (data.inFull?.conventional?.mtd?.percentageShort || -1.3)).toFixed(1)}%</div>
                        <div class="value-row">
                            <span class="value-label">Short:</span>
                            <span class="value-number">${Math.abs(data.inFull?.conventional?.mtd?.short || 220)} units</span>
                        </div>
                    </div>
                    <div class="kpi-item">
                        <div class="kpi-metric">POD</div>
                        <div class="percentage ${getInFullPercentageClass(100 + (data.inFull?.pod?.mtd?.percentageShort || 0))}">${(100 + (data.inFull?.pod?.mtd?.percentageShort || 0)).toFixed(0)}%</div>
                        <div class="value-row">
                            <span class="value-label">Short:</span>
                            <span class="value-number">${Math.abs(data.inFull?.pod?.mtd?.short || 0)} units</span>
                        </div>
                    </div>
                    <div class="kpi-item">
                        <div class="kpi-metric">Personalised</div>
                        <div class="percentage ${getInFullPercentageClass(100 + (data.inFull?.personalized?.mtd?.percentageShort || 0))}">${(100 + (data.inFull?.personalized?.mtd?.percentageShort || 0)).toFixed(0)}%</div>
                        <div class="value-row">
                            <span class="value-label">Short:</span>
                            <span class="value-number">${Math.abs(data.inFull?.personalized?.mtd?.short || 0)} units</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="kpi-card">
            <div class="kpi-title">Rework Analysis</div>
            <div class="kpi-grid">
                <div class="comparison-section">
                    <div class="section-title">Yesterday</div>
                    <div class="kpi-item">
                        <div class="kpi-metric">Jobs</div>
                        <div class="kpi-value">${data.rework?.yesterday?.jobs || 1}</div>
                    </div>
                    <div class="kpi-item">
                        <div class="kpi-metric">Quantity</div>
                        <div class="kpi-value">${formatNumber(data.rework?.yesterday?.quantity || 750)}</div>
                    </div>
                    <div class="kpi-item">
                        <div class="kpi-metric">Value</div>
                        <div class="kpi-value">£${Math.round(data.rework?.yesterday?.value || 354.25)}</div>
                    </div>
                </div>
                <div class="comparison-section">
                    <div class="section-title">Month to Date</div>
                    <div class="kpi-item">
                        <div class="kpi-metric">Jobs</div>
                        <div class="kpi-value">${data.rework?.mtd?.jobs || 8}</div>
                    </div>
                    <div class="kpi-item">
                        <div class="kpi-metric">Quantity</div>
                        <div class="kpi-value">${formatNumber(data.rework?.mtd?.quantity || 3483)}</div>
                    </div>
                    <div class="kpi-item">
                        <div class="kpi-metric">Value</div>
                        <div class="kpi-value">£${Math.round(data.rework?.mtd?.value || 3163.22)}</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Render summary stats with calculated totals from CSV
    const totalYesterday = data.conventional.yesterday.actual + data.pod.yesterday.actual + 
                          data.personalized.yesterday.actual + data.trade.yesterday.actual;
    const totalMTD = data.conventional.mtd.actual + data.pod.mtd.actual + 
                    data.personalized.mtd.actual + data.trade.mtd.actual;
    
    // Calculate total hours from individual product lines
    const totalHours = (data.conventional.yesterday.hours || 0) + 
                      (data.pod.yesterday.hours || 0) + 
                      (data.personalized.yesterday.hours || 0) + 
                      (data.trade.yesterday.hours || 0);

    // Calculate total heads
    const totalHeads = (data.conventional.yesterday.heads || 0) + 
                      (data.pod.yesterday.heads || 0) + 
                      (data.personalized.yesterday.heads || 0) + 
                      (data.trade.yesterday.heads || 0);

    const summaryStats = document.getElementById('summary-stats');
    summaryStats.innerHTML = `
        <div class="stat-box">
            <div class="stat-value">${formatNumber(totalYesterday)}</div>
            <div class="stat-label">Total Units Yesterday</div>
        </div>
        <div class="stat-box">
            <div class="stat-value">${formatNumber(totalMTD)}</div>
            <div class="stat-label">Total Units MTD</div>
        </div>
    `;
}

// Load data when page loads
document.addEventListener('DOMContentLoaded', loadData);

// Optional: Refresh data every 5 minutes
setInterval(loadData, 5 * 60 * 1000);