class SemiFormal < ActionView::Helpers::FormBuilder
  def string(field, *args)
    options = args.extract_options!
    "<div class=\"string\">" +
      label(field, options[:label] || {}) +
      text_field(field, options[:text_field] || {}) +
    "<div>"
  end

  def password(field, *args)
    options = args.extract_options!
    "<div class=\"password\">" +
      label(field, options[:label] || {}) +
      password_field(field, options[:password_field] || {}) +
    "<div>"
  end

  def boolean(field, *args)
    options = args.extract_options!
    "<div class=\"boolean\">" +
      check_box(field, options[:check_box] || {}) +
      label(field, options[:label] || {}) +
    "<div>"
  end

  def numeric(field, *args)
    options = args.extract_options!
    "<div class=\"numeric\">" +
      label(field, options[:label] || {}) +
      text_field(field, options[:text_field] || {}) +
    "<div>"
  end
  alias :integer :numeric
  alias :float   :numeric
  alias :decimal :numeric

  def text(field, *args)
    options = args.extract_options!
    "<div class=\"text\">" +
      label(field, options[:label] || {}) +
      text_area(field, options[:text_area] || {}) +
    "<div>"
  end

  def collection(field, *args)
    options = args.extract_options!

    reflection = @object.class.reflect_on_association(field)
    collection = reflection.class.all.collect {|each| [each.name, each.id] }

    html_options = {}
    options[:include_blank] = true

    if [:has_many, :has_and_belongs_to_many].include?(reflection.macro)
      html_options[:multiple] ||= true
      html_options[:size]     ||= 5
    end

    "<div class=\"collection\">" +
      label(field, options[:label] || {}) +
      select(field, collection, options, html_options)
    "<div>"
  end
end

ActionView::Base.default_form_builder = SemiFormal

