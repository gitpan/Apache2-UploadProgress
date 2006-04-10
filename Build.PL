#!perl

use Module::Build;

my $build_pkg = eval { require Apache::TestMB } ? 'Apache::TestMB' : 'Module::Build';

my $build = $build_pkg->new(
    module_name        => 'Apache2::UploadProgress',
    dist_author        => 'Christian Hansen <chansen@cpan.org>',
    dist_abstract      => 'Track the progress and give realtime feedback of file uploads',
    license            => 'perl',
    create_readme      => 1,
    create_makefile_pl => 'passthrough',
    add_to_cleanup     => [qw(t/logs/cache_file)],
    requires           => {
        'perl'                => 5.006,
        'mod_perl2'           => 2.00,
        'Cache::FastMmap'     => 0,
        'HTTP::Headers::Util' => 0
    },
    build_requires => {
        'Apache::Test' => 1.12,
        'CGI'          => 3.08
    },
);
$build->create_build_script;
