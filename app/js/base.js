$(() => {
    $("#scroll-top-button").on("click", () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    d3.json('data/significant_params.json').then(data => {
        console.log(data);
    });
});