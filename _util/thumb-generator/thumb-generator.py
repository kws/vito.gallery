#!/usr/bin/env python
import os, sys
from optparse import OptionParser
from PIL import Image

def gen_thumbnail(filename, options):
    image = Image.open("%s/%s" %(options.DIR_SRC, filename));
    image.thumbnail((options.DIM, options.DIM), Image.ANTIALIAS)
    image.save("%s/%s" % (options.DIR_THMB, filename))

def list_files(src_dir, ext):
    files = []
    for file in os.listdir(src_dir):
        if file.endswith(ext):
            files.append(file)
    return files

def main():
    usage = "usage: %prog [options] FILES..."
    parser = OptionParser(usage)
    parser.add_option("--src", dest="DIR_SRC",
                       help="The directory where the source images are", default="../../img/vito")
    parser.add_option("--target", dest="DIR_THMB",
                       help="The directory for the thumbnails")
    parser.add_option("--dimension", dest="DIM", default=200,
                       help="The size for the thumbnails. Default 200 (makes 200x200 images)")

    (options, args) = parser.parse_args()

    if not options.DIR_THMB: options.DIR_THMB = options.DIR_SRC + "/thumb"
    options.DIM = int(options.DIM)

    if len(args) == 0:
        files = list_files(options.DIR_SRC, '.jpg');
    else:
        files = []
        for arg in args:
            if arg.isdigit(): arg = arg + ".jpg"
            files.append(arg)

    for file in files:
        gen_thumbnail(file, options)



if __name__ == "__main__":
    main()