#!/usr/bin/env perl

use strict;
use warnings;

use CGI         qw[];
use Digest::MD5 qw[];
use Time::HiRes qw[];

my $id = Digest::MD5::md5_hex( time() . {} . rand() . $$ );
my $q  = CGI->new( sub { Time::HiRes::sleep(0.250) } ); # will give us a nice slowdown

print $q->header(
          -charset  => 'UTF-8',
      ),
      $q->start_html(
          -title    => 'Apache2::UploadProgress Example',
          -encoding => 'UTF-8',
          -script   => [ { -src => 'js/prototype.js'  },
                         { -src => 'js/Jemplate.js'   },
                         { -src => 'js/meter.tmpl.js' },
                         { -src => 'js/upload.js'     } ],
          -style    => { -src => 'css/upload.css' },
      ),
      $q->h1( $q->param('file') ? 'Upload complete!' : 'Apache2::UploadProgress Example' ),
      $q->start_form(
          -action   => sprintf( "%s?progress_id=%s", $q->script_name, $id ),
          -enctype  => 'multipart/form-data',
          -method   => 'POST',
          -onsubmit => 'return startUploadProgress(this);'
      ),
      $q->table(
          $q->Tr( [
              $q->td( [ 'File', $q->filefield( -name => 'file' ) ] ),
              $q->td( [ 'File', $q->filefield( -name => 'file' ) ] )
          ] )
      ),
      $q->div( { -id => 'progress' }, $q->submit ),
      $q->end_form,
      $q->h2('Parameters'),
      $q->Dump,
      $q->end_html;
