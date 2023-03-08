class MultipleCollectionJob# < ActiveJob::Base
  include Sidekiq::Worker
  sidekiq_options queue: 'high'

  def perform(collection_id)
    collection = Collection.find collection_id

    2.upto(collection.no_of_copies) do |cpy|
      dup_collection = collection.dup

      dup_collection = collection.dup.tap do |destination_package|
        destination_package.attachment.attach(collection.attachment.blob)
      end
      
      dup_collection.position = cpy
      dup_collection.metadata_hash = nil
      dup_collection.save
    end
  end
end
