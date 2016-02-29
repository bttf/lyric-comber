const id3 = requireNode('id3js');

export function readTags(filename, cb) {
  id3({ file: filename, type: id3.OPEN_LOCAL }, cb);
}
