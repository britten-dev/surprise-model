# Anatomical head source

`base.obj` is the MakeHuman hm08 base mesh, pinned to commit
`a8bc2d54ff0ac92e78ff71431b1023eda42bf482` from:

https://github.com/makehumancommunity/makehuman/blob/a8bc2d54ff0ac92e78ff71431b1023eda42bf482/makehuman/data/3dobjs/base.obj

The source explicitly identifies the asset as CC0. Its copyright credits are
preserved in the OBJ header; the full CC0 legal text is in `LICENSE.ASSETS.md`.
The project's distinction between application code and assets is documented at:

https://github.com/makehumancommunity/makehuman/blob/a8bc2d54ff0ac92e78ff71431b1023eda42bf482/LICENSE.md

`tools/author-details.py` extracts only the continuous head/neck surface from
the body's face group, scales it to metres and fits it to the original clothed
crew figures. Eyes, hair, hats, hands, garments and all helm fittings are built
by that script. No MakeHuman application code is bundled or executed.
