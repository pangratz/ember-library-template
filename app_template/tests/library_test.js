require('#{APPNAME}/#{LIBRARYNAME}');

module("#{LIBRARYNAME}");

test("Library is defined", function () {
  ok(Library !== undefined, "Library is undefined");
});
