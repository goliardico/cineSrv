# cineSrv

Node.js + Express backend for cineApp android app.

It's scrape the web (with nodejs.cheerio) to find out movies in italian theatres, returns a jsonp with many information and schedules.

Use a MongoDB (nodejs.mongoose) to save user favorites and social features (TODO)

## Installation

### Node.js modules
- express
- mongoose
- cheerio
- request
- iconv

Run with:
```
node app.js
```

## Usage

See app.js for web services exported

## Credits

© 2013, goliardico (only for javascript code).
I don't have any rights on movies, schedules or contents.

## License

    This program is free software; you can redistribute it and/or
    modify it under the terms of the GNU General Public License
    as published by the Free Software Foundation; either version 2
    of the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
