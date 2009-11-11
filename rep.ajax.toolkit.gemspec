# -*- encoding: utf-8 -*-

Gem::Specification.new do |s|
  s.name = %q{rep.ajax.toolkit}
  s.version = "0.1.1"

  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.authors = ["Christopher York"]
  s.date = %q{2009-11-11}
  s.description = %q{Core Hyperstudio jquery code}
  s.email = %q{yorkc@mit.edu}
  s.extra_rdoc_files = ["README", "LICENSE", "TODO"]
  s.files = ["LICENSE", "README", "Rakefile", "TODO", "public/images", "public/images/rep.ajax-validate", "public/images/rep.ajax-validate/green_check.png", "public/images/rep.ajax-validate/red_cross.png", "public/images/rep.ajax-validate/spinner_sm.gif", "public/javascripts", "public/javascripts/rep.ajax-validate.js", "public/javascripts/rep.hint.js", "public/stylesheets", "public/stylesheets/rep.ajax-validate.css", "lib/rep.ajax.toolkit.rb"]
  s.homepage = %q{http://hyperstudio.mit.edu}
  s.require_paths = ["lib"]
  s.rubyforge_project = %q{repertoire}
  s.rubygems_version = %q{1.3.5}
  s.summary = %q{Core Hyperstudio jquery code}

  if s.respond_to? :specification_version then
    current_version = Gem::Specification::CURRENT_SPECIFICATION_VERSION
    s.specification_version = 3

    if Gem::Version.new(Gem::RubyGemsVersion) >= Gem::Version.new('1.2.0') then
      s.add_runtime_dependency(%q<repertoire-assets>, ["~> 0.1.0"])
      s.add_runtime_dependency(%q<rep.jquery>, ["~> 1.3.2"])
    else
      s.add_dependency(%q<repertoire-assets>, ["~> 0.1.0"])
      s.add_dependency(%q<rep.jquery>, ["~> 1.3.2"])
    end
  else
    s.add_dependency(%q<repertoire-assets>, ["~> 0.1.0"])
    s.add_dependency(%q<rep.jquery>, ["~> 1.3.2"])
  end
end
