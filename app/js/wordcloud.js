class HslColorPicker {
    constructor(hue) {
        this.hue = d3.randomNormal(hue, 50);
        this.saturation = d3.randomUniform(20, 100);
        this.lightning = d3.randomUniform(30, 70);
    }

    getColor() {
        const result = `hsl(${d3.min([255, d3.max([0, this.hue()])])}, ${this.saturation()}%, ${this.lightning()}%)`;
        return result;
    }
}

class WordCloud {
    constructor(id) {
        this.id = id;
        this.svg = d3.select(`#${id}`);
        this.svgSize = undefined;
        this.processingId = 0;
        this.activeWordGroup = undefined;
        this.setup();
    }

    setup() {
        const main_color = 'whitesmoke';
        let [sizeX, sizeY] = [700, 500];
        this.svg.attr('viewBox', `0 0 ${sizeX} ${sizeY}`);
        this.svgSize = {
            x: sizeX,
            y: sizeY
        };
    }

    drawWords(words, layout, processId) {
        if (processId === this.processingId) {
            let appearTransition = d3.transition();

            if (this.activeWordGroup !== undefined) {
                appearTransition = appearTransition.delay(1000);
                this.activeWordGroup
                    .transition()
                    .duration(1000)
                    .style('opacity', 0)
                    .remove();
            }
            const colorPicker = new HslColorPicker(126);
            const maxSize = d3.max(words, d => d.size);
            const newGroup = this.svg
                .append('g')
                .attr('transform', `translate(${layout.size()[0] / 2} ${layout.size()[1] / 2})`);
            this.activeWordGroup = newGroup;
            this.activeWordGroup
                .selectAll('text')
                .data(words)
                .enter()
                .append('text')
                .attr('text-anchor', 'middle')
                .attr('fill', (d, i) => colorPicker.getColor())
                .attr('transform', d =>
                    `translate(${d.x}, ${d.y}) rotate(${d.rotate})`)
                .style('opacity', 0)
                .style('font-size', d => `${d.size}px`)
                .text(d => d.text)
                .transition(appearTransition)
                .duration(d => 1000 + (1 - d.size / maxSize) * 5000)
                .style('opacity', 1);
        }
    }

    updateWords(words) {
        const layout = d3.layout.cloud()
            .size([this.svgSize.x, this.svgSize.y])
            .words(words.map(w => ({
                text: w
            })))
            .padding(5)
            .rotate((d, i) => /*~~(Math.random() * 2)*/(i % 2) * 90)
            .fontSize((d, i) => Math.max(15, 60 - i * 3))
            .on('end', d => this.drawWords(d, layout, this.processingId));
        this.processingId++;
        layout.start();
    }
}

$(() => {
    const NUMBER_OF_WORDS = 300;

    const cloud = new WordCloud(
        'wordcloud');

    d3.json('data/wordcloud-words-top-2000.json').then(words => {
        cloud.updateWords(words.slice(0, NUMBER_OF_WORDS));
    });
});