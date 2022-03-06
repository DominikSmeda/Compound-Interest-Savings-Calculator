//@copyright all rights reserved to Dominik Smęda 2022


class Chart {
    constructor(rootDiv, TITLE = '', WIDTH = 1000, HEIGHT = 600) {
        // CAN BE MODIFIED -------------------------
        this.CHART_PADDING = 30;
        this.LINE_COLOR = '#ff6600';
        this.STEP_COLOR = '#ab59ac';
        this.GRID_COLOR = '#00000011';
        this.CHART_BACKGROUND = 'white';
        this.CHART_DIVIDER = 1;
        this.CHART_TITLE = TITLE;
        this.TITLE_FONT = "16px Arial bold";
        this.TITLE_COLOR = '#ff6600';
        this.PICKER_COLOR = 'gray';
        this.CHART_FUNCTION_VALUES_PADDING = 40;
        //AFTER Modification CALL drawChart() //TODO: GETTER/SETTER?
        //-----------------------------------------

        this.rootDiv = rootDiv;
        this.chartCanvas;
        this.uiCanvas;
        this.ctx;
        this.ctxUI;
        this.WIDTH = WIDTH;
        this.HEIGHT = HEIGHT;

        this.metaData = {};
        this.fn = null;

        this.init();
    }

    init() {
        this.chartCanvas = document.createElement('canvas');
        this.chartCanvas.className = 'chart'
        this.chartCanvas.width = this.WIDTH;
        this.chartCanvas.height = this.HEIGHT
        this.chartCanvas.style.zIndex = 10;
        this.ctx = this.chartCanvas.getContext('2d');

        this.uiCanvas = document.createElement('canvas');
        this.uiCanvas.className = 'ui'
        this.uiCanvas.width = this.WIDTH;
        this.uiCanvas.height = this.HEIGHT
        this.uiCanvas.style.zIndex = 11;
        this.ctxUI = this.uiCanvas.getContext('2d');

        this.rootDiv.append(this.chartCanvas);
        this.rootDiv.append(this.uiCanvas);

        this.uiEvents();
    }

    resize(width, height) {
        this.WIDTH = width;
        this.HEIGHT = height;
        this.chartCanvas.width = this.WIDTH;
        this.chartCanvas.height = this.HEIGHT;
        this.uiCanvas.width = this.WIDTH;
        this.uiCanvas.height = this.HEIGHT

        this.drawChart();
    }

    chartTitle(title = this.CHART_TITLE) {
        this.CHART_TITLE = title;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = this.TITLE_COLOR;
        this.ctx.font = this.TITLE_FONT;
        this.ctx.fillText(this.CHART_TITLE, this.WIDTH / 2, this.CHART_PADDING / 2);
    }

    saveAsImage() {
        let image = this.chartCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        console.log(image)
        window.location.href = image;
    }

    drawChart(fn, startX, endX, divider = this.CHART_DIVIDER) {
        this.fn = fn;
        this.ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);

        let rangeX = endX - startX + 1;

        const step = 1 / divider;

        const width = this.WIDTH - 2 * this.CHART_PADDING - this.CHART_FUNCTION_VALUES_PADDING;
        const height = this.HEIGHT - 2 * this.CHART_PADDING;

        this.ctx.save();
        this.ctx.fillStyle = this.CHART_BACKGROUND;
        this.ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);

        this.ctx.beginPath();
        this.ctx.strokeStyle = 'blue';
        this.ctx.moveTo(this.CHART_PADDING, this.HEIGHT - this.CHART_PADDING);

        const fMax = fn(endX);
        const fMin = fn(startX);
        const rangeY = fMax - fMin;
        // console.log(fMin, fMax);

        for (let i = 0; i < ((endX - startX) * divider) + 1; i++) {
            let x = step * i;
            let y = fn(x);

            let chartX = (x * width / (rangeX - 1)) + this.CHART_PADDING;
            let chartY = this.HEIGHT - ((y - fMin) * height / (rangeY)) - this.CHART_PADDING;

            // console.log(`x:${x}, y:${y} | chartX:${chartX}, chartY${chartY} | rangeY:${rangeY}`)

            this.ctx.lineTo(chartX, chartY)

            this.ctx.save();
            this.ctx.fillStyle = this.STEP_COLOR;
            this.ctx.fillRect(chartX - 2, chartY - 2, 4, 4);
            this.ctx.restore();
        }

        this.ctx.strokeStyle = this.LINE_COLOR;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();

        this.ctx.restore();

        //GRID
        this.ctx.save();
        for (let i = 0; i < rangeX; i++) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = this.GRID_COLOR;
            this.ctx.lineWidth = 1;
            this.ctx.moveTo(this.CHART_PADDING + i * width / (rangeX - 1), this.CHART_PADDING);
            this.ctx.lineTo(this.CHART_PADDING + i * width / (rangeX - 1), this.HEIGHT - this.CHART_PADDING);
            this.ctx.stroke();

            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillStyle = 'black';
            this.ctx.fillText(i + startX, this.CHART_PADDING + i * width / (rangeX - 1), this.HEIGHT - this.CHART_PADDING / 2);
        }
        this.ctx.restore();

        this.ctx.save();

        let rangeYGrid = rangeX;
        for (let i = 0; i < rangeYGrid; i++) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = this.GRID_COLOR;
            this.ctx.lineWidth = 1;
            this.ctx.moveTo(this.CHART_PADDING, this.HEIGHT - (this.CHART_PADDING + i * height / (rangeYGrid - 1)));
            this.ctx.lineTo(width + this.CHART_PADDING, this.HEIGHT - (this.CHART_PADDING + i * height / (rangeYGrid - 1)));
            this.ctx.stroke();

            this.ctx.textAlign = 'left';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillStyle = 'black';

            let textY = (i * height / (rangeYGrid - 1))
            let y = (rangeY * textY / height) + fMin;

            this.ctx.fillText(y.toFixed(3), width + this.CHART_PADDING + 10, this.HEIGHT - textY - this.CHART_PADDING);
        }
        this.ctx.restore();

        this.metaData = {
            rangeY,
            rangeX,
            fMax,
            fMin,
            width,
            height,
            startX
        }

        this.chartTitle();
    }

    uiEvents() {

        this.uiCanvas.addEventListener('mousemove', (e) => {
            let rect = e.target.getBoundingClientRect();
            let mouseX = e.clientX - rect.left;
            let mouseY = e.clientY - rect.top;

            this.renderPicker(mouseX, mouseY);
        })
    }

    renderPicker(positionX, positionY) {
        this.ctxUI.clearRect(0, 0, this.WIDTH, this.HEIGHT);

        if (positionX > this.CHART_PADDING && positionY > this.CHART_PADDING && positionX < this.WIDTH - this.CHART_PADDING - this.CHART_FUNCTION_VALUES_PADDING) {
        }
        else {
            return;
        }


        const width = this.metaData.width;
        const height = this.metaData.height;
        const rangeX = this.metaData.rangeX;
        const rangeY = this.metaData.rangeY;
        const fMin = this.metaData.fMin;
        const fMax = this.metaData.fMax;

        let x = ((positionX - this.CHART_PADDING) * (rangeX - 1) / width) + this.metaData.startX;
        let y = this.fn(x);

        this.ctxUI.textAlign = 'left';
        this.ctxUI.textBaseline = 'middle';
        this.ctxUI.fillStyle = 'black';
        this.ctxUI.fillText(`(X=${x.toFixed(3)}, Y=${y.toFixed(3)})`, this.CHART_PADDING, this.CHART_PADDING / 2);

        // let chartX = (x * width / (rangeX - 1)) + CHART_PADDING;
        let chartY = ((y - fMin) * height / rangeY) + this.CHART_PADDING;
        // console.log(chartY)

        this.ctxUI.save();
        this.ctxUI.fillStyle = this.PICKER_COLOR;
        this.ctxUI.strokeStyle = this.PICKER_COLOR;
        this.ctxUI.beginPath();
        this.ctxUI.moveTo(0, this.HEIGHT - chartY);
        this.ctxUI.lineTo(this.WIDTH, this.HEIGHT - chartY);
        this.ctxUI.stroke();

        this.ctxUI.beginPath();
        this.ctxUI.moveTo(positionX, 0);
        this.ctxUI.lineTo(positionX, this.HEIGHT);
        this.ctxUI.stroke();


        this.ctxUI.fillRect(positionX - 2, this.HEIGHT - chartY - 2, 4, 4);

        this.ctxUI.restore();

    }
};

