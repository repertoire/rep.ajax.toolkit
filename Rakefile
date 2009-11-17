require 'rubygems'
require 'rake/gempackagetask'

GEM_NAME = "rep.ajax.toolkit"
GEM_VERSION = "0.1.2"
AUTHOR = "Christopher York"
EMAIL = "yorkc@mit.edu"
HOMEPAGE = "http://hyperstudio.mit.edu"
SUMMARY = "Core Hyperstudio jquery code"

spec = Gem::Specification.new do |s|
  s.rubyforge_project = 'repertoire'
  s.name = GEM_NAME
  s.version = GEM_VERSION
  s.platform = Gem::Platform::RUBY
  s.has_rdoc = true
  s.extra_rdoc_files = ["README", "LICENSE", "TODO"]
  s.summary = SUMMARY
  s.description = s.summary
  s.author = AUTHOR
  s.email = EMAIL
  s.homepage = HOMEPAGE
  s.add_dependency('repertoire-assets', '~>0.1.0')
  s.add_dependency('rep.jquery', '~>1.3.2')
  s.require_path = 'lib'
  s.files = %w(LICENSE README Rakefile TODO) + Dir.glob("{public,lib}/**/*")
end

desc "Create a gemspec file"
task :gemspec do
  File.open("#{GEM_NAME}.gemspec", "w") do |file|
    file.puts spec.to_ruby
  end
end