# cineSrv

Node.js + Express backend for cineApp android app.

First release in December 2013, still works!
Just a few fixes in February 2016 for migration process from Nodejitsu (dead) to Heroku

It's scrape the web (with Cheerio) to find movies in italian theatres, returns a jsonp with many information and schedules.

> IMPORTANT! When the scraped website changed its DOM this app stopped to work. I leave it here because it's was one of my first node.js app.

## Installation

Clone repository where do you want:

```bash
git clone https://github.com/goliardico/cineSrv.git
```

Then install all dependecies:

```bash
npm install
````

Run with:
```bash
node app.js
```

## Usage
Call:

* /all  - list all theatres
* /film - get details about a single film


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
