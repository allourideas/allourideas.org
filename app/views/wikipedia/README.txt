All non-standard views are located here (app/views/wikipedia)

All special controller logic is activated by the "wikipedia?" method (in app/controllers/application_controller)

**Adding a Banner Image
1. Name it consecutively to the last one (e.g. 0010.png follows 0009.png)
  - Fullsize dimensions= 175px tall x 150
  - Thumbnail (0010-thumb.png) = 45x45
2. Place fullsize and thumbnail in public/images/wikipedia/ad/
3. Edit the image selector range to include your image (app/views/wikipedia/earls_show:248)
  - E.g if you're adding 0008.png change the range to (1..8)
  - That's it!
4. Seed ideas for this image (not yet determined)
Banner images should be placed in 