begin
  require 'jeweler'
  Jeweler::Tasks.new do |s|
    s.name = "rep.ajax.toolkit"
    s.summary = "Hyperstudio ajax tools"
    s.description = "Hyperstudio ajax tools"
    s.email = "yorkc@mit.edu"
    s.homepage = "http://github.com/repertoire/rep.ajax.toolkit"
    s.authors = ["Christopher York"]
    s.add_dependency('repertoire-assets', '~>0.1.0')
    s.add_dependency('rep.jquery', '~>1.3.2')
  end
  Jeweler::RubyforgeTasks.new do |rubyforge|
    rubyforge.doc_task = "yardoc"
  end
 
  Jeweler::GemcutterTasks.new
rescue LoadError
  puts "Jeweler not available. Install it with: sudo gem install jeweler"
end