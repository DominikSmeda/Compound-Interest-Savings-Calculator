# Compound-Interest-Savings-Calculator
Implementing Compound Interest Savings Calculator &amp; simple Chart Lib


CHART Customization:
  - CHART_PADDING 
  - LINE_COLOR 
  - STEP_COLOR 
  - GRID_COLOR 
  - CHART_BACKGROUND 
  - CHART_DIVIDER
  - CHART_TITLE 
  - TITLE_FONT 
  - TITLE_COLOR 
  - PICKER_COLOR
  - CHART_FUNCTION_VALUES_PADDING 


> USAGE: 
        
        const chartDiv = document.getElementById('Chart');
        const chart = new Chart(chartDiv, 'Title');

        chart.drawChart((x) => f(x)), 0, years);

        chart.rootDiv.addEventListener('dblclick', () => {
            chart.saveAsImage();
        })
