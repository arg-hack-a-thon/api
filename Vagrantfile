ENV['VAGRANT_DEFAULT_PROVIDER'] = 'docker'
ENV["DOCKER_HOST_VAGRANT_FILE"] ||= "./docker/Dockerhost"
ENV["DOCKER_HOST_VAGRANT_NAME"] ||= "zg-site-docker-host"

# BUILD ALL WITH: vagrant up --no-parallel

POSTGRES_PASSWORD = 'notsosecretpassword'

Vagrant.configure("2") do |config|

  config.vm.define "postgres" do |v|

    v.vm.provider "docker" do |d|
      d.vagrant_machine = ENV["DOCKER_HOST_VAGRANT_NAME"]
      d.vagrant_vagrantfile = ENV["DOCKER_HOST_VAGRANT_FILE"]
      d.image = "postgres:9.4.4"
      d.env = { :POSTGRES_PASSWORD => POSTGRES_PASSWORD }
      d.name = "cloudz_postgres"
      d.remains_running = true
      d.volumes = ["/opt/volumes/cloudz/postgres:/var/lib/postgresql/data"]
      d.ports = [
        "5432:5432"
      ]
    end
  end

  config.vm.define "api" do |v|

    v.vm.synced_folder ".", "/opt/app", type: "rsync",
      rsync__exclude: get_ignored_files(),
      rsync__args: ["--verbose", "--archive", "--delete", "--copy-links"]

    v.vm.provider "docker" do |d|
      d.vagrant_machine = ENV["DOCKER_HOST_VAGRANT_NAME"]
      d.vagrant_vagrantfile = ENV["DOCKER_HOST_VAGRANT_FILE"]
      d.build_dir = "."
      d.build_args = ['--tag="cloudz/api"']
      d.remains_running = true
      d.env = { :POSTGRES_PASSWORD => POSTGRES_PASSWORD }
      d.ports = [
        "8007:8007",    # main application port
        "8787:8787",    # app debugger web port
        "5959:5959",    # app debugger socket port
      ]
      d.link("cloudz_postgres:postgres")
    end
  end

end

def get_ignored_files()
  ignore_file   = ".rsyncignore"
  ignore_array  = []

  if File.exists? ignore_file and File.readable? ignore_file
    File.read(ignore_file).each_line do |line|
      ignore_array << line.chomp
    end
  end

  return ignore_array
end
