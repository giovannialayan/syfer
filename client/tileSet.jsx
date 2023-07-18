const React = require('react');
const ReactDOM = require('react-dom');

class TileSet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tiles: [],
            darkThemeOn: props.darkThemeOn,
            tileTypes: [],
        };
    }

    getTiles() {
        return this.state.tiles;
    }

    setTiles(tiles) {
        let tileTypes = new Array(tiles.length).fill('blank');
        if(this.state.tileTypes.length) {
            tileTypes = this.state.tileTypes;
        }

        this.setState({
            tiles: tiles,
            tileTypes: tileTypes,
        });
    }

    setTileTypes(compareTiles) {
        for(let i = 0; i < this.state.tiles.length; i++) {
            if(this.state.tiles[i] === '_') {
                this.state.tileTypes[i] = 'blank';
            }
            else if(this.state.tiles[i] === compareTiles[i]) {
                this.state.tileTypes[i] = 'correct';
            }
            else {
                this.state.tileTypes[i] = 'almost';
            }
        }

        this.setState({
            tileTypes: this.state.tileTypes,
        });
    }

    setTheme(darkThemeOn) {
        this.setState({
            darkThemeOn: darkThemeOn,
        });
    }

    render() {
        let key = 0;
        const getTile = (tile, darkThemeOnTile) => {
            key++;
            return(
                <div key={key} className={'tile ' + this.state.tileTypes[this.state.tiles.indexOf(tile)] + 'Tile ' + (darkThemeOnTile ? 'darkThemeTile' : 'lightThemeTile')}>
                    <p>{tile}</p>
                </div>
            );
        };
    
        return (
            <section>
                <div className='tileSet'>
                    {this.state.tiles.map(tile => {return getTile(tile, this.state.darkThemeOn);})}
                </div>
            </section>
        );
    }
}

module.exports = {
    TileSet,
}