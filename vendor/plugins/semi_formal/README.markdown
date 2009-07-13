SemiFormal
==========

A FormBuilder meant to play well with [Coulda](http://github.com/dancroak/coulda) and [Evergreen](http://github.com/dancroak/evergreen).

Examples
--------

I had been writing this:

    <% form_for :session, :url => session_path do |form| %>
      <fieldset class="inputs">
        <div class="string">
          <%= form.label      :email %>
          <%= form.text_field :email %>
        </div>
        <div class="password">
          <%= form.label          :password %>
          <%= form.password_field :password %>
        </div>
        <div class="boolean">
          <%= form.check_box :remember_me %>
          <%= form.label     :remember_me %>
        </div>
      </fieldset>
      <fieldset class="buttons">
        <%= form.submit "Sign in", :disable_with => "Please wait..." %>
      </fieldset>
    <% end %>

With SemiFormal, I write this:

    <% form_for :session, :url => session_path do |form| %>
      <fieldset class="inputs">
        <%= form.string   :email %>
        <%= form.password :password %>
        <%= form.boolean  :remember_me %>
      </fieldset>
      <fieldset class="buttons">
        <%= form.submit "Sign in", :disable_with => "Please wait..." %>
      </fieldset>
    <% end %>

Hey, slightly better.

Also available:

    form.text
    form.numeric

numeric is also aliased as integer, decimal, and float to feel migration-like.

Installation
------------

    script/plugin install git://github.com/dancroak/semi_formal.git

