LIBRARYNAME = 'my-library'

require 'colored'
require 'rake-pipeline'

desc "Build #{LIBRARYNAME}"
task :build do
  Rake::Pipeline::Project.new('Assetfile').invoke
end

desc "Clean #{LIBRARYNAME}"
task :clean do
  Rake::Pipeline::Project.new('Assetfile').clean
end

desc "Run tests with PhantomJS"
task :test => :build do
  unless system("which phantomjs > /dev/null 2>&1")
    abort "PhantomJS is not installed. Download from http://phantomjs.org/"
  end

  cmd = "phantomjs tests/qunit/run-qunit.js \"file://#{File.dirname(__FILE__)}/tests/index.html\""

  # Run the tests
  puts "Running #{LIBRARYNAME} tests"
  success = system(cmd)

  if success
    puts "Tests Passed".green
  else
    puts "Tests Failed".red
    exit(1)
  end
end

def setup_uploader(root=Dir.pwd)
  require './lib/github_uploader'

  login = origin = nil

  Dir.chdir(root) do
    # get the github user name
    login = `git config github.user`.chomp

    # get repo from git config's origin url
    origin = `git config remote.origin.url`.chomp # url to origin
    # extract USERNAME/REPO_NAME
    # sample urls: https://github.com/emberjs/ember.js.git
    #              git://github.com/emberjs/ember.js.git
    #              git@github.com:emberjs/ember.js.git
    #              git@github.com:emberjs/ember.js
  end

  repoUrl = origin.match(/github\.com[\/:]((.+?)\/(.+?))(\.git)?$/)
  username = repoUrl[2] # username part of origin url
  repo = repoUrl[3] # repository name part of origin url

  token = ENV["GH_OAUTH_TOKEN"]
  uploader = GithubUploader.new(login, username, repo, token)
  uploader.authorize

  uploader
end

def upload_file(uploader, filename, description, file)
  print "Uploading #{filename}..."
  if uploader.upload_file(filename, description, file)
    puts "Success"
  else
    puts "Failure"
  end
end

desc "Upload latest build of #{LIBRARYNAME} to GitHub repository"
task :upload_latest do
  uploader = setup_uploader

  upload_file(uploader, "#{LIBRARYNAME}-latest.js", "#{LIBRARYNAME} Master", "app/lib/#{LIBRARYNAME}.js")
end

desc "Init app"
task :init do
  Rake::Pipeline::Project.new('Initfile').invoke
  
  FileUtils.rm_rf('app_template')
  FileUtils.rm_rf('templates')
  
  FileUtils.rm_rf('.git')
  `git init`
  
  puts "App initialized. Remove 'init' task from Rakefile"
end
