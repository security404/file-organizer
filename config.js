'use strict';

/**
 * Maps folder names to the file extensions they should contain.
 * Add or modify entries here to customize the organizer.
 */
const CATEGORIES = {
  Images:    ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico', '.tiff', '.heic'],
  Videos:    ['.mp4', '.mov', '.mkv', '.avi', '.wmv', '.flv', '.webm', '.m4v', '.3gp'],
  Audio:     ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.wma', '.m4a', '.opus'],
  Documents: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.csv', '.odt', '.rtf', '.md'],
  Archives:  ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.xz', '.iso'],
  Code:      ['.js', '.ts', '.py', '.java', '.c', '.cpp', '.cs', '.html', '.css', '.php', '.rb', '.go', '.rs', '.json', '.xml', '.sh', '.bat', '.sql'],
  Fonts:     ['.ttf', '.otf', '.woff', '.woff2', '.eot'],
  Ebooks:    ['.epub', '.mobi', '.azw', '.azw3'],
};

/**
 * Folder name for files that don't match any category above
 */
const OTHERS_FOLDER = 'Others';

module.exports = { CATEGORIES, OTHERS_FOLDER };
