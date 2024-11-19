export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      brands: {
        Row: {
          company: number | null
          created_at: string
          featured: boolean | null
          featured_order: number | null
          id: number
          image: string | null
          name: string
        }
        Insert: {
          company?: number | null
          created_at?: string
          featured?: boolean | null
          featured_order?: number | null
          id?: number
          image?: string | null
          name: string
        }
        Update: {
          company?: number | null
          created_at?: string
          featured?: boolean | null
          featured_order?: number | null
          id?: number
          image?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "brands_company_fkey"
            columns: ["company"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          id: number
          image: string | null
          label: string | null
          ref: string | null
          request_count: number | null
          status: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          image?: string | null
          label?: string | null
          ref?: string | null
          request_count?: number | null
          status?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          image?: string | null
          label?: string | null
          ref?: string | null
          request_count?: number | null
          status?: string | null
        }
        Relationships: []
      }
      community_actions: {
        Row: {
          created_at: string
          description: string | null
          id: number
          image: string | null
          path: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          image?: string | null
          path?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          image?: string | null
          path?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_actions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string
          id: number
          image: string | null
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          image?: string | null
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          image?: string | null
          name?: string
        }
        Relationships: []
      }
      contributions: {
        Row: {
          amount: number | null
          category_id: number | null
          created_at: string
          file_url: string | null
          id: number
          kind: string | null
          lab_id: number | null
          name: string | null
          note: string | null
          product_id: number | null
          product_type: Database["public"]["Enums"]["item_type"] | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          category_id?: number | null
          created_at?: string
          file_url?: string | null
          id?: number
          kind?: string | null
          lab_id?: number | null
          name?: string | null
          note?: string | null
          product_id?: number | null
          product_type?: Database["public"]["Enums"]["item_type"] | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          category_id?: number | null
          created_at?: string
          file_url?: string | null
          id?: number
          kind?: string | null
          lab_id?: number | null
          name?: string | null
          note?: string | null
          product_id?: number | null
          product_type?: Database["public"]["Enums"]["item_type"] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contributions_lab_id_fkey"
            columns: ["lab_id"]
            isOneToOne: false
            referencedRelation: "labs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requests_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          id: string
          stripe_customer_id: string | null
        }
        Insert: {
          id: string
          stripe_customer_id?: string | null
        }
        Update: {
          id?: string
          stripe_customer_id?: string | null
        }
        Relationships: []
      }
      deletion_requests: {
        Row: {
          created_at: string
          id: number
          user_id_to_delete: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          user_id_to_delete?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          user_id_to_delete?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deletion_requests_user_id_to_delete_fkey"
            columns: ["user_id_to_delete"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          content: string | null
          created_at: string | null
          embedding: string | null
          id: number
          original_id: number | null
          original_table: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          embedding?: string | null
          id?: number
          original_id?: number | null
          original_table?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          embedding?: string | null
          id?: number
          original_id?: number | null
          original_table?: string | null
        }
        Relationships: []
      }
      email_lists: {
        Row: {
          created_at: string
          email: string
          id: number
          list: Database["public"]["Enums"]["email_subscriptions"] | null
          subscribed: boolean
          uid: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: number
          list?: Database["public"]["Enums"]["email_subscriptions"] | null
          subscribed: boolean
          uid?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: number
          list?: Database["public"]["Enums"]["email_subscriptions"] | null
          subscribed?: boolean
          uid?: string | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: number
          item_id: number
          type: Database["public"]["Enums"]["item_type"] | null
          uid: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          item_id: number
          type?: Database["public"]["Enums"]["item_type"] | null
          uid?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          item_id?: number
          type?: Database["public"]["Enums"]["item_type"] | null
          uid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "favorites_uid_fkey"
            columns: ["uid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ingredients: {
        Row: {
          benefits: string | null
          bonus_score: number | null
          category: Database["public"]["Enums"]["ingredient_category"] | null
          description: string | null
          health_guideline: number | null
          id: number
          image: string | null
          is_common: boolean | null
          is_contaminant: boolean | null
          legal_limit: number | null
          measure: string | null
          name: string
          risks: string | null
          severity_score: number | null
          sources: Json[] | null
          updated_at: string | null
        }
        Insert: {
          benefits?: string | null
          bonus_score?: number | null
          category?: Database["public"]["Enums"]["ingredient_category"] | null
          description?: string | null
          health_guideline?: number | null
          id?: number
          image?: string | null
          is_common?: boolean | null
          is_contaminant?: boolean | null
          legal_limit?: number | null
          measure?: string | null
          name: string
          risks?: string | null
          severity_score?: number | null
          sources?: Json[] | null
          updated_at?: string | null
        }
        Update: {
          benefits?: string | null
          bonus_score?: number | null
          category?: Database["public"]["Enums"]["ingredient_category"] | null
          description?: string | null
          health_guideline?: number | null
          id?: number
          image?: string | null
          is_common?: boolean | null
          is_contaminant?: boolean | null
          legal_limit?: number | null
          measure?: string | null
          name?: string
          risks?: string | null
          severity_score?: number | null
          sources?: Json[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      invite_codes: {
        Row: {
          created_at: string
          id: string
          redemptions: string[] | null
          uid: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          redemptions?: string[] | null
          uid?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          redemptions?: string[] | null
          uid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invite_codes_uid_fkey"
            columns: ["uid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      items: {
        Row: {
          affiliate_url: string | null
          brand: number | null
          company: number
          created_at: string
          description: string | null
          filtration_methods:
            | Database["public"]["Enums"]["water_filtration_methods"][]
            | null
          fts: unknown | null
          id: number
          image: string
          ingredients: Json[] | null
          is_distilled: boolean | null
          is_indexed: boolean | null
          is_private: boolean | null
          lab_updated_at: string | null
          metadata: Json | null
          name: string
          nutrients: Json[] | null
          packaging: Database["public"]["Enums"]["packaging"] | null
          recommended: boolean | null
          score: number | null
          sources: Json[] | null
          tags: string | null
          test_request_count: number | null
          testing_status: Database["public"]["Enums"]["testing_status"] | null
          type: Database["public"]["Enums"]["item_type"]
          updated_at: string | null
          views: number | null
          water_source:
            | Database["public"]["Enums"]["bottled_water_source"]
            | null
        }
        Insert: {
          affiliate_url?: string | null
          brand?: number | null
          company: number
          created_at?: string
          description?: string | null
          filtration_methods?:
            | Database["public"]["Enums"]["water_filtration_methods"][]
            | null
          fts?: unknown | null
          id?: number
          image: string
          ingredients?: Json[] | null
          is_distilled?: boolean | null
          is_indexed?: boolean | null
          is_private?: boolean | null
          lab_updated_at?: string | null
          metadata?: Json | null
          name: string
          nutrients?: Json[] | null
          packaging?: Database["public"]["Enums"]["packaging"] | null
          recommended?: boolean | null
          score?: number | null
          sources?: Json[] | null
          tags?: string | null
          test_request_count?: number | null
          testing_status?: Database["public"]["Enums"]["testing_status"] | null
          type: Database["public"]["Enums"]["item_type"]
          updated_at?: string | null
          views?: number | null
          water_source?:
            | Database["public"]["Enums"]["bottled_water_source"]
            | null
        }
        Update: {
          affiliate_url?: string | null
          brand?: number | null
          company?: number
          created_at?: string
          description?: string | null
          filtration_methods?:
            | Database["public"]["Enums"]["water_filtration_methods"][]
            | null
          fts?: unknown | null
          id?: number
          image?: string
          ingredients?: Json[] | null
          is_distilled?: boolean | null
          is_indexed?: boolean | null
          is_private?: boolean | null
          lab_updated_at?: string | null
          metadata?: Json | null
          name?: string
          nutrients?: Json[] | null
          packaging?: Database["public"]["Enums"]["packaging"] | null
          recommended?: boolean | null
          score?: number | null
          sources?: Json[] | null
          tags?: string | null
          test_request_count?: number | null
          testing_status?: Database["public"]["Enums"]["testing_status"] | null
          type?: Database["public"]["Enums"]["item_type"]
          updated_at?: string | null
          views?: number | null
          water_source?:
            | Database["public"]["Enums"]["bottled_water_source"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "items_brand_fkey"
            columns: ["brand"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "items_company_fkey"
            columns: ["company"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      labs: {
        Row: {
          created_at: string
          id: number
          is_funded: boolean | null
          label: string | null
          parsed_data: Json | null
          product: number | null
          product_type: Database["public"]["Enums"]["item_type"] | null
          raised_amount: number | null
          report: string | null
          sample_date: string | null
          status: Database["public"]["Enums"]["testing_status"] | null
          test_kit: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          is_funded?: boolean | null
          label?: string | null
          parsed_data?: Json | null
          product?: number | null
          product_type?: Database["public"]["Enums"]["item_type"] | null
          raised_amount?: number | null
          report?: string | null
          sample_date?: string | null
          status?: Database["public"]["Enums"]["testing_status"] | null
          test_kit?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          is_funded?: boolean | null
          label?: string | null
          parsed_data?: Json | null
          product?: number | null
          product_type?: Database["public"]["Enums"]["item_type"] | null
          raised_amount?: number | null
          report?: string | null
          sample_date?: string | null
          status?: Database["public"]["Enums"]["testing_status"] | null
          test_kit?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "labs_test_kit_fkey"
            columns: ["test_kit"]
            isOneToOne: false
            referencedRelation: "test_kits"
            referencedColumns: ["id"]
          },
        ]
      }
      nods_page: {
        Row: {
          checksum: string | null
          id: number
          meta: Json | null
          parent_page_id: number | null
          path: string
          source: string | null
          type: string | null
        }
        Insert: {
          checksum?: string | null
          id?: number
          meta?: Json | null
          parent_page_id?: number | null
          path: string
          source?: string | null
          type?: string | null
        }
        Update: {
          checksum?: string | null
          id?: number
          meta?: Json | null
          parent_page_id?: number | null
          path?: string
          source?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nods_page_parent_page_id_fkey"
            columns: ["parent_page_id"]
            isOneToOne: false
            referencedRelation: "nods_page"
            referencedColumns: ["id"]
          },
        ]
      }
      nods_page_section: {
        Row: {
          content: string | null
          embedding: string | null
          heading: string | null
          id: number
          page_id: number
          slug: string | null
          token_count: number | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          heading?: string | null
          id?: number
          page_id: number
          slug?: string | null
          token_count?: number | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          heading?: string | null
          id?: number
          page_id?: number
          slug?: string | null
          token_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "nods_page_section_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "nods_page"
            referencedColumns: ["id"]
          },
        ]
      }
      nutrients: {
        Row: {
          benefits: string | null
          created_at: string
          id: number
          name: string | null
          risks: string | null
          sources: Json[] | null
          unit: string | null
        }
        Insert: {
          benefits?: string | null
          created_at?: string
          id?: number
          name?: string | null
          risks?: string | null
          sources?: Json[] | null
          unit?: string | null
        }
        Update: {
          benefits?: string | null
          created_at?: string
          id?: number
          name?: string | null
          risks?: string | null
          sources?: Json[] | null
          unit?: string | null
        }
        Relationships: []
      }
      prices: {
        Row: {
          active: boolean | null
          currency: string | null
          description: string | null
          id: string
          interval: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count: number | null
          metadata: Json | null
          product_id: string | null
          trial_period_days: number | null
          type: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount: number | null
        }
        Insert: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Update: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id?: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean | null
          description: string | null
          id: string
          image: string | null
          metadata: Json | null
          name: string | null
        }
        Insert: {
          active?: boolean | null
          description?: string | null
          id: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Update: {
          active?: boolean | null
          description?: string | null
          id?: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          amount: number | null
          created_at: string
          currency: string | null
          id: number
          price_id: string | null
          referring_user_id: string | null
          status: string | null
          subscription_id: string | null
          subscription_status: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          id?: number
          price_id?: string | null
          referring_user_id?: string | null
          status?: string | null
          subscription_id?: string | null
          subscription_status?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          id?: number
          price_id?: string | null
          referring_user_id?: string | null
          status?: string | null
          subscription_id?: string | null
          subscription_status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_price_id_fkey"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "prices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      research: {
        Row: {
          created_at: string
          file_url: string | null
          id: number
          title: string | null
        }
        Insert: {
          created_at?: string
          file_url?: string | null
          id?: number
          title?: string | null
        }
        Update: {
          created_at?: string
          file_url?: string | null
          id?: number
          title?: string | null
        }
        Relationships: []
      }
      sources: {
        Row: {
          created_at: string
          date: string | null
          description: string | null
          id: number
          lab_id: number | null
          name: string | null
          type: string | null
          url: string | null
        }
        Insert: {
          created_at?: string
          date?: string | null
          description?: string | null
          id?: number
          lab_id?: number | null
          name?: string | null
          type?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string
          date?: string | null
          description?: string | null
          id?: number
          lab_id?: number | null
          name?: string | null
          type?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sources_lab_id_fkey"
            columns: ["lab_id"]
            isOneToOne: false
            referencedRelation: "labs"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          amount: number | null
          cancel_at: string | null
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created: string
          current_period_end: string
          current_period_start: string
          ended_at: string | null
          id: string
          metadata: Json | null
          platform: string | null
          price_id: string | null
          quantity: number | null
          rc_customer_id: string | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          trial_end: string | null
          trial_start: string | null
          user_id: string
        }
        Insert: {
          amount?: number | null
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id: string
          metadata?: Json | null
          platform?: string | null
          price_id?: string | null
          quantity?: number | null
          rc_customer_id?: string | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id: string
        }
        Update: {
          amount?: number | null
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          platform?: string | null
          price_id?: string | null
          quantity?: number | null
          rc_customer_id?: string | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_price_id_fkey"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "prices"
            referencedColumns: ["id"]
          },
        ]
      }
      tap_water_locations: {
        Row: {
          country: string | null
          created_at: string
          id: number
          image: string | null
          is_featured: boolean | null
          is_indexed: boolean | null
          lat_long: Json | null
          name: string
          score: number | null
          state: string | null
          test_request_count: number | null
          type: Database["public"]["Enums"]["item_type"]
          updated_at: string | null
          utilities: Json[] | null
        }
        Insert: {
          country?: string | null
          created_at?: string
          id?: number
          image?: string | null
          is_featured?: boolean | null
          is_indexed?: boolean | null
          lat_long?: Json | null
          name: string
          score?: number | null
          state?: string | null
          test_request_count?: number | null
          type: Database["public"]["Enums"]["item_type"]
          updated_at?: string | null
          utilities?: Json[] | null
        }
        Update: {
          country?: string | null
          created_at?: string
          id?: number
          image?: string | null
          is_featured?: boolean | null
          is_indexed?: boolean | null
          lat_long?: Json | null
          name?: string
          score?: number | null
          state?: string | null
          test_request_count?: number | null
          type?: Database["public"]["Enums"]["item_type"]
          updated_at?: string | null
          utilities?: Json[] | null
        }
        Relationships: []
      }
      test_kits: {
        Row: {
          created_at: string
          description: string | null
          id: number
          ingredients: number[] | null
          name: string | null
          price: number | null
          product_type: Database["public"]["Enums"]["item_type"] | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          ingredients?: number[] | null
          name?: string | null
          price?: number | null
          product_type?: Database["public"]["Enums"]["item_type"] | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          ingredients?: number[] | null
          name?: string | null
          price?: number | null
          product_type?: Database["public"]["Enums"]["item_type"] | null
        }
        Relationships: []
      }
      users: {
        Row: {
          assistant_id: string | null
          avatar_url: string | null
          billing_address: Json | null
          bio: string | null
          created_at: string
          do_not_override_sub: boolean | null
          email: string | null
          followers: string[] | null
          following: string[] | null
          full_name: string | null
          has_redeemed_free: boolean | null
          has_reviewed_app: boolean | null
          id: string
          is_featured: boolean | null
          is_oasis_public: boolean | null
          is_onboarded: boolean | null
          lab_requests_filters_count: number | null
          lab_requests_items_count: number | null
          lab_requests_tap_water_count: number | null
          location: Json | null
          metadata: Json | null
          newsletter_subscribed: boolean | null
          payment_method: Json | null
          permissions: Database["public"]["Enums"]["permission"] | null
          rc_customer_id: string | null
          redeemed_invite_code: string | null
          referred_by: string | null
          score: number | null
          socials: Json | null
          tap_location_id: number | null
          username: string | null
        }
        Insert: {
          assistant_id?: string | null
          avatar_url?: string | null
          billing_address?: Json | null
          bio?: string | null
          created_at?: string
          do_not_override_sub?: boolean | null
          email?: string | null
          followers?: string[] | null
          following?: string[] | null
          full_name?: string | null
          has_redeemed_free?: boolean | null
          has_reviewed_app?: boolean | null
          id: string
          is_featured?: boolean | null
          is_oasis_public?: boolean | null
          is_onboarded?: boolean | null
          lab_requests_filters_count?: number | null
          lab_requests_items_count?: number | null
          lab_requests_tap_water_count?: number | null
          location?: Json | null
          metadata?: Json | null
          newsletter_subscribed?: boolean | null
          payment_method?: Json | null
          permissions?: Database["public"]["Enums"]["permission"] | null
          rc_customer_id?: string | null
          redeemed_invite_code?: string | null
          referred_by?: string | null
          score?: number | null
          socials?: Json | null
          tap_location_id?: number | null
          username?: string | null
        }
        Update: {
          assistant_id?: string | null
          avatar_url?: string | null
          billing_address?: Json | null
          bio?: string | null
          created_at?: string
          do_not_override_sub?: boolean | null
          email?: string | null
          followers?: string[] | null
          following?: string[] | null
          full_name?: string | null
          has_redeemed_free?: boolean | null
          has_reviewed_app?: boolean | null
          id?: string
          is_featured?: boolean | null
          is_oasis_public?: boolean | null
          is_onboarded?: boolean | null
          lab_requests_filters_count?: number | null
          lab_requests_items_count?: number | null
          lab_requests_tap_water_count?: number | null
          location?: Json | null
          metadata?: Json | null
          newsletter_subscribed?: boolean | null
          payment_method?: Json | null
          permissions?: Database["public"]["Enums"]["permission"] | null
          rc_customer_id?: string | null
          redeemed_invite_code?: string | null
          referred_by?: string | null
          score?: number | null
          socials?: Json | null
          tap_location_id?: number | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_redeemed_invite_code_fkey"
            columns: ["redeemed_invite_code"]
            isOneToOne: false
            referencedRelation: "invite_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_tap_location_id_fkey"
            columns: ["tap_location_id"]
            isOneToOne: false
            referencedRelation: "tap_water_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      water_filters: {
        Row: {
          affiliate_url: string | null
          brand: number | null
          certifications: Database["public"]["Enums"]["certifications"][] | null
          company: number
          contaminants_filtered: number[] | null
          created_at: string
          description: string | null
          filtered_contaminant_categories: Json[] | null
          id: number
          image: string | null
          is_draft: boolean | null
          is_indexed: boolean | null
          name: string
          percent_common_filtered: number | null
          percent_uncommon_filtered: number | null
          recommended: boolean | null
          score: number | null
          sources: Json[] | null
          tags: string | null
          test_request_count: number | null
          type: Database["public"]["Enums"]["item_type"]
          updated_at: string | null
        }
        Insert: {
          affiliate_url?: string | null
          brand?: number | null
          certifications?:
            | Database["public"]["Enums"]["certifications"][]
            | null
          company: number
          contaminants_filtered?: number[] | null
          created_at?: string
          description?: string | null
          filtered_contaminant_categories?: Json[] | null
          id?: number
          image?: string | null
          is_draft?: boolean | null
          is_indexed?: boolean | null
          name: string
          percent_common_filtered?: number | null
          percent_uncommon_filtered?: number | null
          recommended?: boolean | null
          score?: number | null
          sources?: Json[] | null
          tags?: string | null
          test_request_count?: number | null
          type: Database["public"]["Enums"]["item_type"]
          updated_at?: string | null
        }
        Update: {
          affiliate_url?: string | null
          brand?: number | null
          certifications?:
            | Database["public"]["Enums"]["certifications"][]
            | null
          company?: number
          contaminants_filtered?: number[] | null
          created_at?: string
          description?: string | null
          filtered_contaminant_categories?: Json[] | null
          id?: number
          image?: string | null
          is_draft?: boolean | null
          is_indexed?: boolean | null
          name?: string
          percent_common_filtered?: number | null
          percent_uncommon_filtered?: number | null
          recommended?: boolean | null
          score?: number | null
          sources?: Json[] | null
          tags?: string | null
          test_request_count?: number | null
          type?: Database["public"]["Enums"]["item_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "water_filters_brand_fkey"
            columns: ["brand"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "water_filters_company_fkey"
            columns: ["company"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_item_contaminant_count: {
        Args: {
          item_id: number
        }
        Returns: {
          contaminant_count: number
        }[]
      }
      get_items_with_ingredient: {
        Args: {
          ingredient_id: number
        }
        Returns: {
          affiliate_url: string | null
          brand: number | null
          company: number
          created_at: string
          description: string | null
          filtration_methods:
            | Database["public"]["Enums"]["water_filtration_methods"][]
            | null
          fts: unknown | null
          id: number
          image: string
          ingredients: Json[] | null
          is_distilled: boolean | null
          is_indexed: boolean | null
          is_private: boolean | null
          lab_updated_at: string | null
          metadata: Json | null
          name: string
          nutrients: Json[] | null
          packaging: Database["public"]["Enums"]["packaging"] | null
          recommended: boolean | null
          score: number | null
          sources: Json[] | null
          tags: string | null
          test_request_count: number | null
          testing_status: Database["public"]["Enums"]["testing_status"] | null
          type: Database["public"]["Enums"]["item_type"]
          updated_at: string | null
          views: number | null
          water_source:
            | Database["public"]["Enums"]["bottled_water_source"]
            | null
        }[]
      }
      get_page_parents: {
        Args: {
          page_id: number
        }
        Returns: {
          id: number
          parent_page_id: number
          path: string
          meta: Json
        }[]
      }
      get_random_filters: {
        Args: Record<PropertyKey, never>
        Returns: {
          affiliate_url: string | null
          brand: number | null
          certifications: Database["public"]["Enums"]["certifications"][] | null
          company: number
          contaminants_filtered: number[] | null
          created_at: string
          description: string | null
          filtered_contaminant_categories: Json[] | null
          id: number
          image: string | null
          is_draft: boolean | null
          is_indexed: boolean | null
          name: string
          percent_common_filtered: number | null
          percent_uncommon_filtered: number | null
          recommended: boolean | null
          score: number | null
          sources: Json[] | null
          tags: string | null
          test_request_count: number | null
          type: Database["public"]["Enums"]["item_type"]
          updated_at: string | null
        }[]
      }
      get_random_items: {
        Args: Record<PropertyKey, never>
        Returns: {
          affiliate_url: string | null
          brand: number | null
          company: number
          created_at: string
          description: string | null
          filtration_methods:
            | Database["public"]["Enums"]["water_filtration_methods"][]
            | null
          fts: unknown | null
          id: number
          image: string
          ingredients: Json[] | null
          is_distilled: boolean | null
          is_indexed: boolean | null
          is_private: boolean | null
          lab_updated_at: string | null
          metadata: Json | null
          name: string
          nutrients: Json[] | null
          packaging: Database["public"]["Enums"]["packaging"] | null
          recommended: boolean | null
          score: number | null
          sources: Json[] | null
          tags: string | null
          test_request_count: number | null
          testing_status: Database["public"]["Enums"]["testing_status"] | null
          type: Database["public"]["Enums"]["item_type"]
          updated_at: string | null
          views: number | null
          water_source:
            | Database["public"]["Enums"]["bottled_water_source"]
            | null
        }[]
      }
      get_random_locations: {
        Args: Record<PropertyKey, never>
        Returns: {
          country: string | null
          created_at: string
          id: number
          image: string | null
          is_featured: boolean | null
          is_indexed: boolean | null
          lat_long: Json | null
          name: string
          score: number | null
          state: string | null
          test_request_count: number | null
          type: Database["public"]["Enums"]["item_type"]
          updated_at: string | null
          utilities: Json[] | null
        }[]
      }
      get_users_with_favorites: {
        Args: {
          page_number?: number
          page_size?: number
        }
        Returns: {
          id: string
          full_name: string
          username: string
          bio: string
          is_featured: boolean
          avatar_url: string
          score: number
          total_count: number
          most_recent_favorite: string
        }[]
      }
      hnswhandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      increment: {
        Args: {
          table_name: string
          column_name: string
          record_id: number
          amount: number
        }
        Returns: undefined
      }
      increment_user_column: {
        Args: {
          table_name: string
          column_name: string
          user_id: string
          amount: number
        }
        Returns: undefined
      }
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      match_documents: {
        Args: {
          query_embedding: string
          match_threshold: number
          match_count: number
        }
        Returns: {
          id: number
          content: string
          original_table: string
          original_id: number
          similarity: number
        }[]
      }
      match_page_sections: {
        Args: {
          embedding: string
          match_threshold: number
          match_count: number
          min_content_length: number
        }
        Returns: {
          id: number
          page_id: number
          slug: string
          heading: string
          content: string
          similarity: number
        }[]
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: string
      }
      vector_dims: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
    }
    Enums: {
      bottled_water_metadata: "source" | "treatment_process" | "ph_level"
      bottled_water_source:
        | "municipal_supply"
        | "mountain_spring"
        | "aquifer"
        | "iceberg"
        | "spring"
        | "well"
        | "rain"
        | "unknown"
        | "young_coconut"
        | "mature_coconut"
        | "coconut_water"
      certifications: "NSF" | "IAPMO" | "WQA" | "SGS" | "ANAB" | "ISO"
      email_subscriptions: "newsletter"
      ingredient_category:
        | "Chemical Disinfectants"
        | "Fluoride"
        | "Haloacetic Acids"
        | "Heavy Metals"
        | "Herbicides"
        | "Microplastics"
        | "Perfluorinated Chemicals (PFAS)"
        | "Pesticides"
        | "Pharmaceuticals"
        | "Phthalates"
        | "Radiological Elements"
        | "Semi-Volatile Compounds"
        | "Volatile Organic Compounds (VOCs)"
        | "Microbiologicals"
        | "Minerals"
        | "Inorganics"
        | "Other"
        | "Disinfectant by-product"
        | "Fruits"
        | "Juices"
        | "Additives"
        | "Botanicals"
        | "Sweeteners"
        | "Fibers"
        | "Prebiotics"
        | "Organic Acids"
        | "Trihalomethanes"
        | "Synthetics"
        | "Inorganic ingredients"
        | "Vitamins"
        | "Amino Acids"
      item_type:
        | "bottled_water"
        | "tap_water"
        | "filter"
        | "flavored_water"
        | "mineral_packets"
        | "water_gallon"
        | "shower_filter"
        | "bottle_filter"
        | "energy_drink"
        | "sports_drink"
        | "coconut_water"
      packaging:
        | "plastic"
        | "glass"
        | "cardboard"
        | "aluminum"
        | "aluminum (can)"
      permission: "admin" | "manager" | "user" | "owner"
      pricing_plan_interval: "day" | "week" | "month" | "year"
      pricing_type: "one_time" | "recurring"
      subscription_status:
        | "trialing"
        | "active"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "past_due"
        | "unpaid"
        | "paused"
        | "expired"
        | "in_grace_period"
        | "in_billing_retry"
      testing_status:
        | "complete"
        | "in_progress"
        | "untested"
        | "out_of_date"
        | "not_started"
      water_filtration_methods:
        | "Distillation"
        | "Reverse osmosis"
        | "Ion exchange"
        | "Ultraviolet (UV) Treatment"
        | "Carbon Filtration"
        | "Micron Filtration"
        | "Ozone Treatment"
        | "Electrodeionization"
        | "Mineral Addition"
        | "Aeration"
        | "Ionization"
        | "Natural"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
