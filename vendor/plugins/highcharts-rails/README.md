# highcharts-rails

Highcharts-rails is a simple helper for displaying Highcharts graphs in your Rails application. This plugin is completely dependent on the [Highcharts javascript library](http://highcharts.com) by Torstein Hønsi.

Highcharts-rails accepts a combination of hashes and arrays that formatted in a way that Highcharts expects and allows developers to calculate chart data and format chart data/labels/tooltips in the controller and/or model instead of the view.

This plugin is packaged with [Highcharts 1.1.3](http://highcharts.com/download), and [jQuery 1.3.2](http://docs.jquery.com/Release:jQuery_1.3.2).

## Installation

Get the plugin:

	script/plugin install git://github.com/loudpixel/highcharts-rails.git
	
Run the rake setup:

	rake highcharts_rails:install

## Usage

Include the following in the head of your application layout:

	<%= javascript_include_tag 'jquery-1.3.2.min', 'highcharts' %>
	<!--[if IE]>
		<%= javascript_include_tag 'excanvas.compiled' %>
	<![endif]-->

Some people like to put their javascript at the bottom of the page, regardless of your preference you should include the following to write your javascript, unless you feel it necessary to include your javascript in each view.

	<script type="text/javascript">
		$(document).ready(function() {
			<%= yield :javascript %>
		});
	</script>

We can collect all of our data, and format everything we need to in our controller:

	# Create a pie chart
	browser_data = [
	  {:name => 'Safari',               :y => 3.57,     :identifier => 'applewebkit'},
	  {:name => 'Firefox',              :y => 22.32,    :identifier => 'gecko'}, 
	  {:name => 'Internet Explorer',    :y => 56.9,     :identifier => 'msie'}, 
	  {:name => 'Other',                :y => 17.21}
	]

	user_agent = request.env['HTTP_USER_AGENT'].downcase

	# determine the users browser and pull that piece of the pie chart
	browser_data.each do |browser|
	  if user_agent.index(browser[:identifier].to_s)
	    browser[:sliced] = true
    
	    # some browsers will match more than one identifier, stop looking as soon as one is found
	    break;
	  end
	end

	# format the labels that show up on the chart
	pie_label_formatter = '
	  function() {
	    if (this.y > 15) return this.point.name;
	  }

	# format the tooltips
	pie_tooltip_formatter = '
	  function() {
	    return "<strong>" + this.point.name + "</strong>: " + this.y + " %";
	  }'
  
	@pie_chart = 
		Highchart.pie({
	    :chart => {
			  :renderTo => "pie-chart-container",
			  :margin => [50, 30, 0, 30]
			},
			:credits => {
			  :enabled => true,
			  :href => 'http://marketshare.hitslink.com/browser-market-share.aspx?qprid=3',
			  :text => 'Data provided by NETMARKETSHARE'
			},
			:plotOptions => {
			  :pie => {
			    :dataLabels => {
			      :formatter => pie_label_formatter, 
			      :style => {
			        :textShadow => '#000000 1px 1px 2px'
			      }
			    }
			  }
			},
		  :series => [
				{
					:type => 'pie',
					:data => browser_data
				}
			],
			:subtitle => {
			  :text => 'January 2010'
			},
			:title => {
			  :text => 'Browser Market Share'
			},
			:tooltip => {
			  :formatter => pie_tooltip_formatter
			},
		})

In your views you can use a content block to provide the above your javascript and markup for the chart. This will generate a string of javascript that will produce the Highcharts graph and insert into the div:

	<!-- container to hold the pie chart -->
	<div id="pie-chart-container" class="chart-container"></div>
 
	<% content_for :javascripts do %>
		<%= @pie_chart %>
	<% end %>
