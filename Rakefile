begin
  require 'jeweler'
  Jeweler::Tasks.new do |s|
    s.name = "rep.ajax.toolkit"
    s.summary = "Hyperstudio ajax tools"
    s.description = "Hyperstudio ajax tools"
    s.email = "yorkc@mit.edu"
    s.homepage = "http://github.com/repertoire/rep.ajax.toolkit"
    s.authors = ["Christopher York", "Dave Della Costa"]
  end
  Jeweler::RubyforgeTasks.new do |rubyforge|
    rubyforge.doc_task = "yardoc"
  end
 
  Jeweler::GemcutterTasks.new
rescue LoadError
  puts "Jeweler not available. Install it with: sudo gem install jeweler"
end

begin
  require 'repertoire-assets'
rescue LoadError
  puts "Repertoire assets not available.  Install it with: sudo gem install repertoire-assets"
end